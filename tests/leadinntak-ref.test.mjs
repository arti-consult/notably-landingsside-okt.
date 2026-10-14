import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';
import { fixture } from './helpers/consent-fixture.mjs';
import { revokeMarketingTracking } from '../src/lib/analytics.ts';
import { startMarketingScriptsLoader } from '../src/lib/marketing-loader.ts';
import { decorateDemo, decorateSignup, leadAttribution } from '../src/lib/marketing-attribution.ts';
import { DEMO_BOOKING_URL, normalizeRef } from '../src/lib/marketing-policy.ts';
import { sendWaitlistLead } from '../src/lib/lead-inbound.ts';

// Henvisningskode (?ref=) og «Book en demo» i Notably OS. ref er ikke en sporings-ID: sendes uten samtykke, men bare med gyldig format.
let cleanup = () => {}, dom;
const originalFetch = globalThis.fetch;
const NAMES = ['window', 'document', 'Element', 'MutationObserver', 'Event', 'StorageEvent'];
function browser(url, state = 'unset') {
  dom = new JSDOM(`<!doctype html><head><script id="bootstrap"></script></head><body>
    <nav><a id="cta" data-trial-cta="navigation" href="https://app.notably.no/no/sign-up">Start gratis</a></nav>
    <section id="pricing"><a id="cta2" href="https://app.notably.no/en/sign-up">Start free</a><a id="demo" href="${DEMO_BOOKING_URL}">Book en demo</a></section></body>`,
  { url, pretendToBeVisual: true, virtualConsole: new VirtualConsole() });
  for (const name of NAMES) globalThis[name] = name === 'window' ? dom.window : dom.window[name];
  const f = fixture(state); globalThis.fetch = f.fetch; revokeMarketingTracking();
  return { f, document: dom.window.document };
}
const settle = () => new Promise(r => setTimeout(r, 25));
afterEach(() => { cleanup(); cleanup = () => {}; if (dom) { revokeMarketingTracking(); dom.window.close(); dom = null; } globalThis.fetch = originalFetch; for (const n of NAMES) delete globalThis[n]; });

test('normalizeRef: små bokstaver, [a-z0-9_-], maks 40 tegn', () => {
  assert.equal(normalizeRef('partner-1'), 'partner-1');
  assert.equal(normalizeRef('Partner_X'), 'partner_x');
  assert.equal(normalizeRef(' abc '), 'abc');
  assert.equal(normalizeRef('a'.repeat(40)), 'a'.repeat(40));
  assert.equal(normalizeRef('a'.repeat(41)), null);
  for (const bad of ['', 'ugyldig ref', 'æøå', 'a.b', '<script>', 'a/b', null, undefined]) assert.equal(normalizeRef(bad), null, String(bad));
});

test('decorateSignup/decorateDemo: ref alltid (validert), klikk-id/utm bare med samtykke', () => {
  const input = { sourceUrl: 'https://notably.no/', identifiers: { gclid: 'G1', fbclid: 'F1' }, utm: { utm_source: 'meta' } };
  assert.equal(new URL(decorateSignup('https://app.notably.no/no/sign-up', null, 'Partner-X')).search, '?ref=partner-x');
  assert.equal(new URL(decorateSignup('https://app.notably.no/no/sign-up', null, 'x'.repeat(41))).search, '');
  const demo = new URL(decorateDemo(DEMO_BOOKING_URL, input, 'partner-x'));
  assert.equal(demo.origin + demo.pathname, 'https://os.notably.no/book/demo');
  assert.deepEqual(Object.fromEntries(demo.searchParams), { gclid: 'G1', fbclid: 'F1', utm_source: 'meta', ref: 'partner-x' });
  assert.equal(new URL(decorateDemo(DEMO_BOOKING_URL + '?gclid=stale&ref=old', null, 'ny-kode')).search, '?ref=ny-kode');
  assert.equal(new URL(decorateDemo(DEMO_BOOKING_URL, null, 'ugyldig ref')).search, '');
  for (const other of ['https://os.notably.no/book/kevin', 'https://evil.test/book/demo', 'https://calendly.com/arti-jorgen/notably-demo']) assert.equal(decorateDemo(other, input, 'partner-x'), other);
});

test('uten samtykke: alle påmeldingslenker og «Book en demo» får ref (små bokstaver), ingen sporings-ID-er', async () => {
  const e = browser('https://www.notably.no/?ref=Partner-X&gclid=OFFLINE_CLICK&utm_source=google');
  cleanup = startMarketingScriptsLoader(); await settle();
  for (const id of ['cta', 'cta2', 'demo']) {
    const u = new URL(e.document.querySelector('#' + id).href);
    assert.equal(u.searchParams.get('ref'), 'partner-x', id);
    assert.equal(u.searchParams.has('gclid') || u.searchParams.has('utm_source'), false, id);
  }
  // Lenker som legges til senere (lazy seksjoner) får også ref.
  const a = e.document.createElement('a'); a.href = 'https://app.notably.no/no/sign-up'; e.document.body.append(a); await settle();
  assert.equal(new URL(a.href).searchParams.get('ref'), 'partner-x');
});

test('ugyldig ref (for lang / feil tegn) sendes ikke videre', async () => {
  const e = browser(`https://www.notably.no/?ref=${'k'.repeat(41)}`);
  cleanup = startMarketingScriptsLoader(); await settle();
  for (const id of ['cta', 'demo']) assert.equal(new URL(e.document.querySelector('#' + id).href).searchParams.has('ref'), false, id);
});

test('med samtykke: «Book en demo» får klikk-id og utm som påmeldingslenken', async () => {
  const e = browser('https://www.notably.no/?gclid=OFFLINE_CLICK&utm_source=google&ref=sales_1', 'granted');
  cleanup = startMarketingScriptsLoader(); await settle();
  const demo = new URL(e.document.querySelector('#demo').href);
  assert.equal(demo.searchParams.get('gclid'), 'OFFLINE_CLICK'); assert.equal(demo.searchParams.get('utm_source'), 'google'); assert.equal(demo.searchParams.get('ref'), 'sales_1');
});

test('venteliste → Notably OS: ref alltid, utm/klikk-id bare med samtykke; feil svelges', async () => {
  assert.deepEqual(leadAttribution(new URL('https://notably.no/?ref=ABC&gclid=G&utm_source=meta'), false), { ref: 'abc' });
  assert.deepEqual(leadAttribution(new URL('https://notably.no/?ref=ABC&gclid=G&utm_source=meta'), true), { gclid: 'G', utm_source: 'meta', ref: 'abc' });
  const sent = [];
  const fake = async (url, init) => { sent.push({ url, body: JSON.parse(init.body), init }); return new Response('{}', { status: 200 }); };
  assert.equal(await sendWaitlistLead('ola@firma.no', fake, 'https://notably.no/?ref=Partner-X&fbclid=F', false), true);
  assert.equal(sent[0].url, 'https://os.notably.no/api/leads/inbound');
  assert.equal(sent[0].init.credentials, 'omit');
  assert.equal(sent[0].body.source, 'venteliste'); assert.equal(sent[0].body.email, 'ola@firma.no'); assert.match(sent[0].body.key, /^[0-9a-f-]{36}$/);
  assert.deepEqual(sent[0].body.attribution, { ref: 'partner-x', landing_page: 'https://notably.no/' });
  assert.equal(await sendWaitlistLead('ola@firma.no', async () => { throw new Error('offline'); }, 'https://notably.no/', false), false);
});
