import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { JSDOM } from 'jsdom';
import { BOOKING_ORIGIN, demoEmbedSrc, lockScroll, readBookingMessage, startDemoModalLinks, trapFocus } from '../src/lib/demo-modal.ts';
import { decorateDemo } from '../src/lib/marketing-attribution.ts';
import { DEMO_BOOKING_URL } from '../src/lib/marketing-policy.ts';

// «Book en demo» som modal: iframe mot os.notably.no/book/demo?embed=1 med samme attribusjon som lenken, meldinger bare fra OS.
let dom;
const NAMES = ['window', 'document', 'Element', 'HTMLElement', 'Node'];
function browser(html = '') {
  dom = new JSDOM(`<!doctype html><body>${html}</body>`, { url: 'https://www.notably.no/?ref=partner-x', pretendToBeVisual: true });
  for (const n of NAMES) globalThis[n] = n === 'window' ? dom.window : dom.window[n];
  return dom.window.document;
}
afterEach(() => { if (dom) { dom.window.close(); dom = null; } for (const n of NAMES) delete globalThis[n]; });

test('demoEmbedSrc: bare os.notably.no/book/demo, beholder attribusjon fra decorateDemo og legger på embed=1', () => {
  const decorated = decorateDemo(DEMO_BOOKING_URL, { sourceUrl: 'https://notably.no/', identifiers: { gclid: 'G1' }, utm: { utm_source: 'google' } }, 'partner-x');
  const u = new URL(demoEmbedSrc(decorated));
  assert.equal(u.origin + u.pathname, 'https://os.notably.no/book/demo');
  assert.deepEqual(Object.fromEntries(u.searchParams), { gclid: 'G1', utm_source: 'google', ref: 'partner-x', embed: '1' });
  assert.equal(new URL(demoEmbedSrc(DEMO_BOOKING_URL)).search, '?embed=1');
  for (const other of ['https://os.notably.no/book/kevin', 'https://evil.test/book/demo', 'https://app.notably.no/no/sign-up', 'mailto:hei@notably.no', 'ikke en url'])
    assert.equal(demoEmbedSrc(other), null, other);
});

test('readBookingMessage: bare origin https://os.notably.no, bare vår iframe, bare kjent form', () => {
  const frame = {};
  const ok = (data, origin = BOOKING_ORIGIN, source = frame) => readBookingMessage({ origin, data, source }, frame);
  assert.deepEqual(ok({ type: 'notably:booking', status: 'booked', start: '2026-10-20T08:00:00.000Z' }), { status: 'booked', start: '2026-10-20T08:00:00.000Z' });
  assert.deepEqual(ok({ type: 'notably:booking', status: 'booked', start: 'tull' }), { status: 'booked', start: null });
  assert.deepEqual(ok({ type: 'notably:booking', status: 'ready' }), { status: 'ready' });
  assert.deepEqual(ok({ type: 'notably:booking', status: 'close' }), { status: 'close' });
  for (const origin of ['https://evil.test', 'https://os.notably.no.evil.test', 'http://os.notably.no', 'https://notably.no', 'null', ''])
    assert.equal(ok({ type: 'notably:booking', status: 'booked', start: '2026-10-20T08:00:00.000Z' }, origin), null, origin);
  assert.equal(ok({ type: 'notably:booking', status: 'booked' }, BOOKING_ORIGIN, {}), null, 'annen kilde enn vår iframe');
  for (const data of [null, 'booked', { type: 'other', status: 'booked' }, { type: 'notably:booking', status: 'hacked' }]) assert.equal(ok(data), null, JSON.stringify(data));
});

test('klikk på demo-lenke åpner modal (preventDefault); modifikator/midtklikk og andre lenker går som før', () => {
  const doc = browser(`<a id="demo" href="${DEMO_BOOKING_URL}?ref=partner-x" target="_blank">Book en demo</a><a id="signup" href="https://app.notably.no/no/sign-up">Start</a><span id="inner"></span>`);
  doc.querySelector('#demo').append(doc.querySelector('#inner'));
  const opened = [];
  const stop = startDemoModalLinks((src, href) => opened.push({ src, href }));
  const click = (el, init = {}) => { const e = new dom.window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init }); el.dispatchEvent(e); return e.defaultPrevented; };
  assert.equal(click(doc.querySelector('#inner')), true);
  assert.deepEqual(opened, [{ src: 'https://os.notably.no/book/demo?ref=partner-x&embed=1', href: 'https://os.notably.no/book/demo?ref=partner-x' }]);
  for (const init of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) assert.equal(click(doc.querySelector('#demo'), init), false, JSON.stringify(init));
  assert.equal(click(doc.querySelector('#signup')), false);
  assert.equal(opened.length, 1);
  stop();
  assert.equal(click(doc.querySelector('#demo')), false, 'lytteren fjernes');
});

test('fokusfelle og scroll-lås', () => {
  const doc = browser('<button id="out">ute</button><div id="m"><button id="a">a</button><iframe id="f"></iframe><button id="b">b</button></div>');
  const root = doc.querySelector('#m');
  const tab = (shiftKey = false) => { const e = new dom.window.KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true }); trapFocus(e, root); return e; };
  doc.querySelector('#b').focus();
  assert.equal(tab().defaultPrevented, true); assert.equal(doc.activeElement.id, 'a');
  assert.equal(tab(true).defaultPrevented, true); assert.equal(doc.activeElement.id, 'b');
  doc.querySelector('#out').focus(); tab(); assert.equal(doc.activeElement.id, 'a', 'fokus utenfor hentes inn');
  doc.body.style.overflow = 'auto';
  const unlock = lockScroll(doc);
  assert.equal(doc.body.style.overflow, 'hidden');
  unlock();
  assert.equal(doc.body.style.overflow, 'auto');
});

test('modalen: lastes på alle sider, fallback etter ~8 s, lukk via ESC/bakgrunn/knapp, fullskjerm ≤640px, ingen egne SDK-kall', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../src/components/DemoBookingModal.tsx', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8');
  assert.match(main, /<DemoBookingModal \/>/);
  assert.match(src, /FALLBACK_MS = 8000/);
  assert.match(src, /e\.key === 'Escape'/);
  assert.match(src, /data-demo-backdrop/);
  assert.match(src, /aria-modal="true"/);
  assert.match(src, /h-full w-full[^"]*sm:h-\[min\(760px/, 'fullskjerm under sm (640px), vindu over');
  assert.match(src, /Åpne i ny fane/);
  assert.doesNotMatch(src, /fbq|gtag|ttq|dataLayer/, 'sporingsleverandørene har fortsatt én eier');
});

test('Åpne i ny fane inside the modal is not intercepted as another modal opening', () => {
  const doc = browser('<div data-demo-modal><a href="https://os.notably.no/book/demo" target="_blank">Åpne i ny fane</a></div>');
  let opened = 0;
  const stop = startDemoModalLinks(() => opened++);
  const event = new dom.window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
  doc.querySelector('a').dispatchEvent(event);
  assert.equal(event.defaultPrevented, false);
  assert.equal(opened, 0);
  stop();
});
