import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';
import { fixture } from './helpers/consent-fixture.mjs';
import { consentClient } from '../src/lib/consent.ts';
import { initMarketingTracking, revokeMarketingTracking, suspendTrackingForReload, trackStartTrialClick } from '../src/lib/analytics.ts';
import { startDemoTracking } from '../src/lib/demo-tracking.ts';
import { BOOKING_ORIGIN, readBookingMessage, startDemoModalLinks } from '../src/lib/demo-modal.ts';

// All APIs mocked; jsdom never fetches provider SDKs. No real booking/conversion is created.
let dom;
const originalFetch = globalThis.fetch;
const globals = ['window', 'document', 'Element', 'Event'];
const id = 'd7f45c9a-12a8-4d9a-9412-11b200982ee3';
const data = { type: 'notably:booking', status: 'booked', start: '2026-10-20T08:00:00.000Z', confirmation: { version: 1, id } };
const frame = {};
const message = (value = data, origin = BOOKING_ORIGIN, source = frame) => readBookingMessage({ data: value, origin, source }, frame);
async function browser(permissions = { analytics: true, advertising: true }, url = 'https://www.notably.no/') {
  dom = new JSDOM('<!doctype html><head><script></script></head><body><nav><a href="https://os.notably.no/book/demo"><span>Book en demo</span></a></nav></body>', { url, virtualConsole: new VirtualConsole() });
  for (const n of globals) globalThis[n] = n === 'window' ? dom.window : dom.window[n];
  const f = fixture(); f.setPermissions(permissions); globalThis.fetch = f.fetch;
  revokeMarketingTracking();
  await consentClient.refresh().catch(error => { if (error.message !== 'CONSENT_DISABLED') throw error; });
  return { f, anchor: document.querySelector('a') };
}
const ga = () => window.dataLayer?.filter(x => x[0] === 'event') ?? [];
const meta = () => window.fbq?.queue?.filter(x => x[0] === 'trackSingleCustom') ?? [];
afterEach(() => {
  if (dom) { revokeMarketingTracking(); dom.window.close(); }
  globalThis.fetch = originalFetch;
  for (const n of globals) delete globalThis[n];
});

for (const permissions of [{ analytics: true, advertising: true }, { analytics: true, advertising: false }, { analytics: false, advertising: true }, { analytics: false, advertising: false }]) {
  test(`demo events obey each existing consent purpose: ${JSON.stringify(permissions)}`, async () => {
    const { anchor } = await browser(permissions);
    startDemoTracking(anchor, true)(message());
    assert.deepEqual(ga().map(x => x[1]), permissions.analytics ? ['demo_click', 'demo_booked'] : []);
    assert.deepEqual(meta().map(x => x[2]), permissions.advertising ? ['DemoClick', 'DemoBooked'] : []);
    assert.equal(ga().some(x => x[1] === 'conversion'), false, 'no native Google Ads signup action');
    for (const x of ga()) {
      assert.equal(x[2].send_to, 'G-NJRML2BKQP');
      assert.equal(x[2].button_id, 'navigation');
      assert.equal(x[2].page_path, '/');
      assert.doesNotMatch(JSON.stringify(x), /start_at|2026-10-20|manage_url|attendee|agenda|join_url/);
    }
    if (permissions.analytics && permissions.advertising) assert.equal(ga()[1][2].event_id, meta()[1][4].eventID);
    if (!permissions.analytics && !permissions.advertising) assert.equal(document.querySelectorAll('script[src]').length, 0);
  });
}

test('only versioned confirmed messages from the exact current iframe can be measured', async () => {
  const { anchor } = await browser(); const receive = startDemoTracking(anchor, true);
  for (const m of [message(data, 'https://evil.test'), message(data, BOOKING_ORIGIN, {}), message(data, BOOKING_ORIGIN, null)]) assert.equal(m, null);
  for (const value of [
    { ...data, confirmation: undefined }, { ...data, confirmation: { version: 2, id } },
    { ...data, confirmation: { version: 1, id: 'bad' } }, { ...data, start: 'invalid' },
    { type: 'notably:booking', status: 'ready' }, { type: 'notably:booking', status: 'close' },
  ]) receive(message(value));
  assert.deepEqual(ga().map(x => x[1]), ['demo_click']);
  receive(message()); receive(message());
  // Reopening/remounting does not count a repeated confirmation again.
  startDemoTracking(anchor, true)(message());
  assert.equal(ga().filter(x => x[1] === 'demo_booked').length, 1);
  assert.equal(meta().filter(x => x[2] === 'DemoBooked').length, 1);
});

test('consent is rechecked on confirmation and unconsented bookings are never replayed', async () => {
  const { anchor } = await browser(); const receive = startDemoTracking(anchor, true);
  await consentClient.choose(false);
  receive(message());
  assert.equal(ga().filter(x => x[1] === 'demo_booked').length, 0);
  await consentClient.choose({ analytics: true, advertising: true });
  receive(message()); startDemoTracking(anchor, true)(message());
  assert.equal(ga().filter(x => x[1] === 'demo_booked').length, 0);
  assert.equal(meta().filter(x => x[2] === 'DemoBooked').length, 0);
});

test('demo measurements share initialized SDKs and preserve the existing signup destinations', async () => {
  const { anchor } = await browser(); initMarketingTracking();
  const configs = window.dataLayer.filter(x => x[0] === 'config').length;
  startDemoTracking(anchor, true)(message());
  trackStartTrialClick({ button_id: 'hero', page_path: '/' });
  assert.equal(window.dataLayer.filter(x => x[0] === 'config').length, configs);
  assert.equal(document.querySelectorAll('#notably-google-script').length, 1);
  assert.equal(document.querySelectorAll('#notably-fb-script').length, 1);
  const ads = ga().filter(x => x[1] === 'conversion');
  assert.equal(ads.length, 1); assert.equal(ads[0][2].send_to, 'AW-17626822366/I0M7CK2bwawcEN7tj9VB');
  assert.equal(meta().filter(x => x[2] === 'StartTrialClick').length, 1);
  assert.equal(window.fbq.queue.some(x => x.includes('StartTrial')), false);
});

test('synthetic openings, preview hosts, unsafe URLs and unloading pages do not measure', async () => {
  const { anchor } = await browser();
  startDemoTracking(anchor, false)(message()); assert.equal(ga().length, 0);
  suspendTrackingForReload(); startDemoTracking(anchor, true)(message()); assert.equal(ga().length, 0);
});
for (const url of ['http://localhost:5173/', 'https://test.notably.no/', 'https://www.notably.no/?email=private', 'https://www.notably.no/admin']) {
  test(`no demo events on ${url}`, async () => {
    const { anchor } = await browser(undefined, url); startDemoTracking(anchor, true)(message());
    assert.equal(ga().length, 0); assert.equal(meta().length, 0);
    assert.equal(document.querySelectorAll('script[src]').length, 0);
  });
}

test('a provider failure cannot break opening or confirmation', async () => {
  const { anchor } = await browser(); initMarketingTracking();
  // Fail event delivery while retaining the existing consent-mode operation.
  const original = window.gtag;
  window.gtag = (...args) => { if (args[0] === 'event') throw new Error('blocked'); original(...args); };
  const receive = startDemoTracking(anchor, true);
  assert.doesNotThrow(() => receive(message()));
  assert.deepEqual(meta().map(x => x[2]), ['DemoClick', 'DemoBooked']);
});

test('delegation passes trust and placement only for normal modal openings, including keyboard activation', async () => {
  await browser(); let click; let opened = 0;
  const add = document.addEventListener.bind(document);
  document.addEventListener = (type, listener, ...args) => { if (type === 'click') click = listener; return add(type, listener, ...args); };
  const stop = startDemoModalLinks((src, href, anchor, trusted) => { opened++; startDemoTracking(anchor, trusted); });
  const event = { isTrusted: true, defaultPrevented: false, target: document.querySelector('span'), button: 0, preventDefault() {} };
  click(event); // Pointer or keyboard Enter.
  click({ ...event, metaKey: true }); click({ ...event, button: 1 }); click({ ...event, defaultPrevented: true });
  click({ ...event, isTrusted: false });
  assert.equal(opened, 2); assert.equal(ga().filter(x => x[1] === 'demo_click').length, 1);
  stop();
});
