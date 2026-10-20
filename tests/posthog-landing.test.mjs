import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM, VirtualConsole } from 'jsdom';
import { fixture, deferred } from './helpers/consent-fixture.mjs';
import { consentClient } from '../src/lib/consent.ts';
import { acknowledgePostHogDisclosure, forgetPostHogDisclosure, hasPostHogConsent, POSTHOG_DISCLOSURE_KEY } from '../src/lib/posthog-consent.ts';
import { createLandingAnalytics } from '../src/lib/posthog-landing.ts';

const originalFetch = globalThis.fetch;
let dom, controller;
const globals = ['window', 'document', 'Event', 'StorageEvent'];
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
async function browser(permissions = { analytics: true, advertising: true }, url = 'https://www.notably.no/?utm_source=google&utm_campaign=accountants&gclid=PRIVATE_AD_ID') {
  dom = new JSDOM('<!doctype html><head></head><body></body>', { url, referrer: 'https://www.google.com/search?q=private', virtualConsole: new VirtualConsole() });
  for (const name of globals) globalThis[name] = name === 'window' ? dom.window : dom.window[name];
  const f = fixture(); f.setPermissions(permissions); globalThis.fetch = f.fetch;
  await consentClient.refresh().catch(error => { if (error.message !== 'CONSENT_DISABLED') throw error; });
  return f;
}
function fake() {
  const events = [], calls = []; let config;
  return { events, calls, get config() { return config; },
    init(token, c) { config = c; calls.push('init'); },
    set_config(c) { Object.assign(config, c); calls.push('config'); },
    opt_in_capturing() { calls.push('opt-in'); }, opt_out_capturing() { calls.push('opt-out'); },
    stopSessionRecording() { calls.push('stop-replay'); },
    capture(event, properties) {
      const result = config.before_send({ event, properties: {
        distinct_id: 'anonymous-test', $session_id: 'session-test', $device_type: 'Desktop',
        $current_url: window.location.href, $referrer: document.referrer,
        gclid: 'PRIVATE_AD_ID', email: 'private@example.test', $set: { email: 'private@example.test' },
        $initial_current_url: window.location.href, ...properties,
      } });
      if (result) events.push(result);
    },
  };
}
afterEach(() => {
  controller?.stop(); controller = undefined;
  dom?.window.close(); dom = undefined; globalThis.fetch = originalFetch;
  for (const key of globals) delete globalThis[key];
});

test('an existing analytics grant alone never loads PostHog or writes its receipt', async () => {
  await browser(); let loads = 0;
  controller = createLandingAnalytics(async () => { loads++; return fake(); });
  await controller.sync(); controller.capture('demo_click', { button_id: 'hero', page_path: '/' });
  await tick(); assert.equal(loads, 0); assert.equal(window.localStorage.length, 0);
});
for (const permissions of [{ analytics: true, advertising: true }, { analytics: true, advertising: false }, { analytics: false, advertising: true }, { analytics: false, advertising: false }]) {
  test(`PostHog obeys analytics independently: ${JSON.stringify(permissions)}`, async () => {
    await browser(permissions); acknowledgePostHogDisclosure(); const sdk = fake(); let loads = 0;
    controller = createLandingAnalytics(async () => { loads++; return sdk; });
    await controller.sync(); await controller.sync();
    controller.capture('demo_click', { button_id: 'hero', page_path: '/' }); await tick();
    assert.equal(loads, permissions.analytics ? 1 : 0);
    assert.deepEqual(sdk.events.map(e => e.event), permissions.analytics ? ['$pageview', 'demo_click'] : []);
    for (const event of sdk.events) {
      assert.equal(event.properties.utm_source, permissions.advertising ? 'google' : undefined);
      assert.equal(event.properties.$current_url, 'https://www.notably.no/');
      assert.doesNotMatch(JSON.stringify(event), /PRIVATE_AD_ID|private@example|search\?q|gclid|\$set|\$initial_current_url/);
    }
  });
}

test('native scrollmaps retain only the sanitized public previous pathname', async () => {
  await browser(); acknowledgePostHogDisclosure(); const sdk = fake();
  controller = createLandingAnalytics(async () => sdk); await controller.sync();
  for (const event of ['$pageview', '$pageleave']) {
    sdk.capture(event, { $prev_pageview_pathname: '/regnskapsforer?email=private@example.test#PRIVATE', $prev_pageview_max_content_percentage: 0.8 });
    assert.equal(sdk.events.at(-1).properties.$prev_pageview_pathname, '/regnskapsforer');
    assert.equal(sdk.events.at(-1).properties.$prev_pageview_max_content_percentage, 0.8);
    assert.doesNotMatch(JSON.stringify(sdk.events.at(-1)), /private@example|PRIVATE/);
  }
  for (const path of ['/admin', '//other.example/path', 'https://other.example/', '/\\\\other.example/path', 42]) {
    sdk.capture('$pageleave', { $prev_pageview_pathname: path });
    assert.equal(sdk.events.at(-1).properties.$prev_pageview_pathname, undefined);
  }
});

test('revocation during a slow SDK load drops queued clicks and never initializes the SDK', async () => {
  await browser(); acknowledgePostHogDisclosure(); const sdk = fake(), load = deferred();
  controller = createLandingAnalytics(() => load.promise);
  const pending = controller.sync(); controller.capture('demo_click', { button_id: 'hero', page_path: '/' });
  forgetPostHogDisclosure(); await consentClient.choose({ analytics: false, advertising: true });
  load.resolve(sdk); await pending; await tick();
  assert.equal(sdk.calls.length, 0); assert.equal(sdk.events.length, 0);
});

test('withdrawal stops replay and persistence synchronously; old events never replay on re-consent', async () => {
  await browser(); acknowledgePostHogDisclosure(); const sdk = fake();
  controller = createLandingAnalytics(async () => sdk); await controller.sync();
  forgetPostHogDisclosure();
  assert.ok(sdk.calls.includes('opt-out')); assert.ok(sdk.calls.includes('stop-replay'));
  assert.equal(sdk.config.disable_persistence, true); assert.equal(sdk.config.capture_heatmaps, false);
  controller.capture('demo_booked', { button_id: 'hero', page_path: '/' });
  await consentClient.choose(false); await consentClient.choose(true); acknowledgePostHogDisclosure();
  await controller.sync(); await tick();
  assert.equal(sdk.events.some(e => e.event === 'demo_booked'), false);
});

test('new server revision, server failure and forged local acknowledgement cannot grant analytics', async () => {
  const f = await browser(); acknowledgePostHogDisclosure(); assert.equal(hasPostHogConsent(), true);
  f.setPermissions({ analytics: true, advertising: true }); await consentClient.refresh();
  assert.equal(hasPostHogConsent(), false);
  acknowledgePostHogDisclosure();
  f.intercept(() => { throw new Error('offline'); }); await assert.rejects(consentClient.refresh());
  assert.equal(hasPostHogConsent(), false);
  assert.ok(window.localStorage.getItem(POSTHOG_DISCLOSURE_KEY));
});

test('unavailable acknowledgement storage leaves SDK off', async () => {
  await browser(); Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  assert.doesNotThrow(acknowledgePostHogDisclosure); assert.equal(hasPostHogConsent(), false);
});

for (const url of ['http://localhost:5173/', 'https://preview.vercel.app/', 'https://www.notably.no/admin', 'https://www.notably.no/?email=private', 'https://www.notably.no/?utm_source=a&utm_source=b']) {
  test(`no PostHog on preview/private/unsafe page: ${url}`, async () => {
    await browser(undefined, url); acknowledgePostHogDisclosure(); let loads = 0;
    controller = createLandingAnalytics(async () => { loads++; return fake(); });
    await controller.sync(); assert.equal(loads, 0);
  });
}

test('route changes count each public page once and stop capture on private routes', async () => {
  await browser(); acknowledgePostHogDisclosure(); const sdk = fake();
  controller = createLandingAnalytics(async () => sdk); await controller.sync();
  window.history.pushState({}, '', '/regnskapsforer'); await controller.sync(); await controller.sync();
  assert.deepEqual(sdk.events.map(e => [e.event, e.properties.$pathname]), [
    ['$pageview', '/'], ['$pageleave', '/'], ['$pageview', '/regnskapsforer'],
  ]);
  window.history.pushState({}, '', '/admin'); await controller.sync();
  controller.capture('demo_click', { button_id: 'hero', page_path: '/admin' }); await tick();
  assert.equal(sdk.events.length, 3); assert.ok(sdk.calls.includes('opt-out'));
});

test('SDK failure cannot throw into consent, rendering or CTA flow', async () => {
  await browser(); acknowledgePostHogDisclosure(); let loads = 0;
  controller = createLandingAnalytics(async () => { loads++; throw new Error('ad blocker'); });
  await assert.doesNotReject(controller.sync());
  assert.doesNotThrow(() => controller.capture('demo_click', { button_id: 'hero', page_path: '/' }));
  await tick(); await controller.sync(); assert.equal(loads, 1);
});

test('recording masks inputs, text and attributes and blocks forms, booking and network payloads', async () => {
  await browser(); acknowledgePostHogDisclosure(); const sdk = fake();
  controller = createLandingAnalytics(async () => sdk); await controller.sync();
  const c = sdk.config;
  assert.deepEqual(c.autocapture.dom_event_allowlist, ['click']); assert.equal(c.person_profiles, 'never');
  assert.equal(c.autocapture.capture_copied_text, false);
  assert.match(c.autocapture.css_selector_ignorelist.join(','), /data-posthog-private/);
  assert.equal(c.mask_all_text, true); assert.equal(c.mask_all_element_attributes, true);
  assert.equal(c.capture_performance.web_vitals, true); assert.equal(c.capture_performance.network_timing, false);
  assert.equal(c.capture_performance.web_vitals_attribution, false); assert.equal(c.enable_recording_console_log, false);
  assert.equal(c.session_recording.maskAllInputs, true);
  assert.equal(c.session_recording.maskAttributeFn('href', 'https://app.notably.no/?gclid=secret').includes('secret'), false);
  assert.equal(c.session_recording.maskAttributeFn('data-email', 'private@example.test').includes('private'), false);
  assert.equal(c.session_recording.maskAttributeFn('class', 'flex items-center'), 'flex items-center');
  assert.equal(c.session_recording.maskAttributeFn('style', 'background:url(https://private.test)').includes('https'), false);
  assert.equal(c.session_recording.maskTextSelector, '*');
  assert.match(c.session_recording.blockSelector, /iframe/); assert.match(c.session_recording.blockSelector, /form/);
  assert.match(c.session_recording.blockSelector, /data-demo-modal/);
  assert.equal(c.session_recording.maskCapturedNetworkRequestFn({ name: 'https://api.notably.no/private', isInitial: false }), null);
  assert.equal(c.session_recording.maskCapturedNetworkRequestFn({ name: window.location.href, isInitial: true }).name, 'https://www.notably.no/');
  assert.equal(c.session_recording.maskNetworkRequestFn({ url: window.location.href }).url, 'https://www.notably.no/');
  assert.equal(c.before_send({ event: '$autocapture', properties: { text: 'private' } }), null);
});

test('native clickmaps retain only structural element metadata, never labels or destinations', async () => {
  await browser(); acknowledgePostHogDisclosure(); const sdk = fake();
  controller = createLandingAnalytics(async () => sdk); await controller.sync();
  const result = sdk.config.before_send({ event: '$autocapture', properties: {
    $event_type: 'click', $el_text: 'PRIVATE', $elements_chain: 'PRIVATE',
    $elements: [{tag_name:'a',nth_child:2,nth_of_type:1,attr__href:'https://app.notably.no/?gclid=PRIVATE', $el_text:'PRIVATE',attr__id:'PRIVATE'},null],
  } });
  assert.deepEqual(result.properties.$elements, [{tag_name:'a',nth_child:2,nth_of_type:1},{}]);
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE|gclid|\$el_text|attr__/);
  assert.equal(sdk.config.before_send({ event:'$autocapture',properties:{$event_type:'change',$elements:[]} }),null);
  const chain='a:nth-child="2"nth-of-type="1";div:nth-child="1"nth-of-type="1";body:nth-child="2"nth-of-type="1"';
  assert.equal(sdk.config.before_send({event:'$autocapture',properties:{$event_type:'click',$elements_chain:chain}}).properties.$elements_chain,chain);
  assert.equal(sdk.config.before_send({event:'$autocapture',properties:{$event_type:'click',$elements_chain:chain+';a:href="PRIVATE"'}}),null);

});

test('performance reports contain numeric vitals only and do not move to a later SPA route', async () => {
  await browser(); acknowledgePostHogDisclosure(); const sdk=fake();
  controller=createLandingAnalytics(async()=>sdk); await controller.sync();
  const event={event:'$web_vitals',properties:{$web_vitals_LCP_value:1234,$web_vitals_INP_value:NaN,$web_vitals_CLS_value:-1,$web_vitals_LCP_event:{url:'PRIVATE',entries:['PRIVATE']}}};
  const result=sdk.config.before_send(event);
  assert.equal(result.properties.$web_vitals_LCP_value,1234);
  assert.equal(result.properties.$web_vitals_INP_value,undefined);
  assert.equal(result.properties.$web_vitals_CLS_value,undefined);
  assert.doesNotMatch(JSON.stringify(result),/PRIVATE/);
  window.history.pushState({},'', '/advokat');await controller.sync();
  assert.equal(sdk.config.before_send(event),null);
});

test('engagement and errors accept only fixed categories, never entered business data',async()=>{
  await browser();acknowledgePostHogDisclosure();const sdk=fake();
  controller=createLandingAnalytics(async()=>sdk);await controller.sync();
  const props={section_id:'pricing',question_id:'question-2',contact_type:'email',visible_seconds:5,error_category:'runtime_error',message:'PRIVATE',stack:'PRIVATE',email:'PRIVATE',slider_value:12345};
  const result=sdk.config.before_send({event:'section_viewed',properties:props});
  assert.equal(result.properties.section_id,'pricing');assert.equal(result.properties.question_id,'question-2');
  assert.doesNotMatch(JSON.stringify(result),/PRIVATE|slider_value/);
  const bad=sdk.config.before_send({event:'landing_error',properties:{error_category:'PRIVATE',section_id:'PRIVATE',question_id:'PRIVATE'}});
  assert.equal(bad.properties.error_category,undefined);assert.equal(bad.properties.section_id,undefined);
  forgetPostHogDisclosure();
  assert.equal(sdk.config.before_send({event:'section_viewed',properties:props}),null);
});
