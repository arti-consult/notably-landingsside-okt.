import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';
import { fixture, deferred } from './helpers/consent-fixture.mjs';
import { consentClient } from '../src/lib/consent.ts';
import { observePricingView, recordUsageEvent } from '../src/lib/usage-events.ts';

const originalFetch = globalThis.fetch;
let dom, cleanup = () => {}, observer;
function browser(path = '/', permissions = { analytics: true, advertising: false }, origin = 'https://notably.no') {
  dom = new JSDOM('<!doctype html><section id="pricing"></section>', { url: origin + path, pretendToBeVisual: true, virtualConsole: new VirtualConsole() });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observer = this; }
    observe(element) { this.element = element; }
    disconnect() { this.disconnected = true; }
    emit(ratio) { this.callback([{ target: this.element, isIntersecting: ratio > 0, intersectionRatio: ratio }]); }
  };
  const f = fixture();
  f.setPermissions(permissions);
  const events = [];
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/usage-events')) {
      events.push({ url, options, body: JSON.parse(options.body) });
      return new Response(JSON.stringify({ status: 'success', recorded: true }));
    }
    return f.fetch(url, options);
  };
  return { f, events, element: document.getElementById('pricing') };
}
afterEach(() => {
  cleanup(); cleanup = () => {};
  dom?.window.close();
  globalThis.fetch = originalFetch;
  for (const key of ['window', 'document', 'IntersectionObserver']) delete globalThis[key];
});

test('analytics-only sales click sends bounded anonymous context with existing consent authorization', async () => {
  const e = browser('/advokat?email=private@example.test#private');
  await consentClient.refresh();
  assert.equal(recordUsageEvent('sales.clicked', 'advokat'), true);
  assert.equal(e.events.length, 1);
  const { options, body } = e.events[0];
  assert.deepEqual(Object.keys(body).sort(), ['eventName', 'expectedRevision', 'page', 'requestId']);
  assert.equal(body.eventName, 'sales.clicked'); assert.equal(body.page, 'advokat');
  assert.match(body.requestId, /^[0-9a-f-]{36}$/);
  assert.equal(options.credentials, 'include'); assert.equal(options.keepalive, true);
  assert.equal(options.referrerPolicy, 'no-referrer'); assert.equal(options.redirect, 'error');
  assert.equal(options.headers['X-Notably-Consent-CSRF'], 'offline-csrf-token');
  assert.equal(JSON.stringify(body).includes('private'), false);
  assert.equal(recordUsageEvent('sales.clicked', 'home'), false);
});

test('pricing records only a visible impression once across repeated observation and strict-mode effect setup', async () => {
  const e = browser(); await consentClient.refresh();
  const state = { recorded: false };
  cleanup = observePricingView(e.element, 'home', state);
  assert.equal(e.events.length, 0);
  observer.emit(0); observer.emit(0.05); assert.equal(e.events.length, 0);
  observer.emit(0.25); observer.emit(0); observer.emit(0.5);
  assert.equal(e.events.length, 1);
  cleanup(); assert.equal(observer.disconnected, true);
  cleanup = observePricingView(e.element, 'home', state); observer.emit(0.5);
  assert.equal(e.events.length, 1);
  assert.equal(e.events[0].body.eventName, 'pricing.viewed');
});

test('a currently visible pricing section can count after explicit analytics grant, with no earlier capture', async () => {
  const e = browser('/', { analytics: false, advertising: true }); await consentClient.refresh();
  cleanup = observePricingView(e.element, 'home', { recorded: false }); observer.emit(0.5);
  assert.equal(e.events.length, 0); assert.equal(recordUsageEvent('sales.clicked', 'home'), false);
  await consentClient.choose({ analytics: true, advertising: true });
  assert.equal(e.events.length, 1); assert.equal(e.events[0].body.eventName, 'pricing.viewed');
});

test('pending analytics withdrawal suppresses capture before the server response', async () => {
  const e = browser(); await consentClient.refresh();
  const gate = deferred();
  e.f.intercept(async ({ body }) => { if (body?.action === 'withdraw') await gate.promise; });
  const withdrawal = consentClient.choose({ analytics: false, advertising: false });
  assert.equal(recordUsageEvent('sales.clicked', 'home'), false);
  assert.equal(e.events.length, 0);
  gate.resolve(); await withdrawal;
});

test('failed event delivery does not change consent or throw into contact navigation', async () => {
  const e = browser(); await consentClient.refresh();
  const permission = consentClient.view().permissions;
  globalThis.fetch = async () => { throw new Error('offline'); };
  assert.equal(recordUsageEvent('sales.clicked', 'home'), true);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.deepEqual(consentClient.view().permissions, permission);
  assert.equal(e.events.length, 0);
});

test('background tabs do not create impressions until the document becomes visible', async () => {
  const e = browser(); await consentClient.refresh();
  let visibility = 'hidden';
  Object.defineProperty(document, 'visibilityState', { get: () => visibility });
  cleanup = observePricingView(e.element, 'home', { recorded: false }); observer.emit(0.5);
  assert.equal(e.events.length, 0);
  visibility = 'visible'; document.dispatchEvent(new dom.window.Event('visibilitychange'));
  assert.equal(e.events.length, 1);
});

test('disposed pricing observers and unavailable browser observation do not invent views', async () => {
  const e = browser(); await consentClient.refresh();
  const stop = observePricingView(e.element, 'home', { recorded: false }); stop(); observer.emit(0.5);
  assert.equal(e.events.length, 0);
  delete globalThis.IntersectionObserver;
  cleanup = observePricingView(e.element, 'home', { recorded: false });
  assert.equal(e.events.length, 0);
});

for (const origin of ['http://localhost:5173', 'https://test.notably.no', 'https://preview.vercel.app']) {
  test(`no usage requests from ${origin}`, () => {
    const e = browser('/', undefined, origin);
    assert.equal(recordUsageEvent('sales.clicked', 'home'), false);
    assert.equal(e.events.length, 0);
  });
}
