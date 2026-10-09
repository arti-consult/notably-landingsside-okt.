import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';
import { fixture } from './helpers/consent-fixture.mjs';
import { consentClient } from '../src/lib/consent.ts';
import { initMarketingTracking, revokeMarketingTracking, trackStartTrialClick } from '../src/lib/analytics.ts';
import { startMarketingScriptsLoader } from '../src/lib/marketing-loader.ts';
import { readAttribution, decorateSignup, canCaptureSource } from '../src/lib/marketing-attribution.ts';
import { isSafeProviderPage } from '../src/lib/marketing-policy.ts';

// jsdom does not load resources or run page scripts. All API requests are mocked.
// OFFLINE_* identifiers below never leave this process.
let cleanup=()=>{},dom;
const originalFetch=globalThis.fetch;
function browser(url='https://www.notably.no/',state='unset') {
  dom=new JSDOM('<!doctype html><head><script id="bootstrap"></script></head><body><nav><a id="cta" data-trial-cta="navigation" href="https://app.notably.no/no/sign-up"><span>Start gratis</span></a></nav></body>',{url,pretendToBeVisual:true,virtualConsole:new VirtualConsole()});
  for(const name of ['window','document','Element','MutationObserver','Event','StorageEvent'])globalThis[name]=name==='window'?dom.window:dom.window[name];
  const f=fixture(state);globalThis.fetch=f.fetch;revokeMarketingTracking();
  return {f,window:dom.window,document:dom.window.document};
}
const settle=()=>new Promise(r=>setTimeout(r,25));
afterEach(()=>{cleanup();cleanup=()=>{};if(dom){revokeMarketingTracking();dom.window.close();}globalThis.fetch=originalFetch;for(const name of ['window','document','Element','MutationObserver','Event','StorageEvent'])delete globalThis[name];});

test('no scripts, attribution POST or decorated identifiers before explicit server grant',async()=>{
  const e=browser('https://www.notably.no/?gclid=OFFLINE_CLICK&utm_source=google');
  e.window.localStorage.setItem('notably.consent.v1',JSON.stringify({marketing:'granted'}));
  cleanup=startMarketingScriptsLoader();await settle();
  assert.equal(e.document.querySelectorAll('script[src]').length,0);
  assert.equal(e.f.calls.some(c=>c.url.endsWith('/attribution')),false);
  assert.equal(e.document.querySelector('#cta').search,'');
});

test('consented capture precedes one SDK initialization and preserves genuine campaign attribution',async()=>{
  const e=browser('https://www.notably.no/?gclid=OFFLINE_CLICK&fbclid=OFFLINE_META&utm_source=google&ref=sales_1','granted');
  cleanup=startMarketingScriptsLoader();await settle();
  assert.equal(e.f.calls.filter(c=>c.url.endsWith('/attribution')).length,1);
  assert.equal(e.f.calls.find(c=>c.url.endsWith('/attribution')).body.sourceUrl,'https://www.notably.no/');
  const link=new URL(e.document.querySelector('#cta').href);
  assert.equal(link.searchParams.get('gclid'),'OFFLINE_CLICK');assert.equal(link.searchParams.get('ref'),'sales_1');
  assert.equal(e.document.querySelectorAll('#notably-google-script').length,1);assert.equal(e.document.querySelectorAll('#notably-fb-script').length,1);
  assert.equal(e.document.querySelectorAll('script[src*="gtm.js"]').length,0); // One Meta pixel owner.
  initMarketingTracking();e.window.dispatchEvent(new Event('focus'));await settle();
  assert.equal(e.document.querySelectorAll('#notably-google-script').length,1);
  assert.equal(e.f.calls.filter(c=>c.url.endsWith('/attribution')).length,1); // Do not refresh ad click timestamps on focus.
  const config=e.window.dataLayer.find(x=>x[0]==='config');assert.match(config[2].page_location,/gclid=OFFLINE_CLICK/);
  assert.equal(config[2].allow_ad_personalization_signals,false);
  assert.equal(e.window.dataLayer.filter(x=>x[0]==='event'&&x[1]==='page_view').length,0); // GA owns enhanced history pageviews.
});

test('late-rendered CTAs receive attribution; denial removes it and suppresses optional events immediately',async()=>{
  const e=browser('https://www.notably.no/?wbraid=OFFLINE_BRAID&ref=sales_1','granted');cleanup=startMarketingScriptsLoader();await settle();
  const a=e.document.createElement('a');a.href='https://app.notably.no/en/sign-up';a.textContent='Start free';e.document.body.append(a);await settle();
  assert.equal(new URL(a.href).searchParams.get('wbraid'),'OFFLINE_BRAID');
  const pending=consentClient.choose(false);assert.equal(consentClient.view().granted,false);await settle();
  assert.equal(new URL(a.href).searchParams.has('wbraid'),false);assert.equal(new URL(a.href).searchParams.get('ref'),'sales_1');
  const before=e.window.dataLayer.length;trackStartTrialClick({button_id:'navigation',page_path:'/'});assert.equal(e.window.dataLayer.length,before);
  assert.equal(e.window['ga-disable-G-NJRML2BKQP'],true);await pending;
});

test('CTA emits one distinct event per provider with shared ID, never a trial-start conversion',async()=>{
  const e=browser('https://www.notably.no/advokat','granted');await consentClient.refresh();
  trackStartTrialClick({button_id:'hero',page_path:'/advokat'});
  const google=e.window.dataLayer.filter(x=>x[0]==='event'&&x[1]==='start_trial_click');const meta=e.window.fbq.queue.filter(x=>x[0]==='trackSingleCustom');
  assert.equal(google.length,1);assert.equal(google[0][1],'start_trial_click');assert.equal(meta.length,1);assert.equal(meta[0][2],'StartTrialClick');
  assert.equal(google[0][2].event_id,meta[0][4].eventID);
  const ads=e.window.dataLayer.filter(x=>x[0]==='event'&&x[1]==='conversion');assert.equal(ads.length,1);assert.equal(ads[0][2].send_to,'AW-17626822366/I0M7CK2bwawcEN7tj9VB');assert.equal(ads[0][2].transaction_id,google[0][2].event_id);assert.deepEqual(meta[0][3],{button_id:'hero',page_path:'/advokat'});
  assert.equal(e.window.fbq.queue.some(x=>x.includes('StartTrial')),false);
});

for(const url of ['https://test.notably.no/','https://notably-preview.vercel.app/','http://localhost:5173/','https://notably.no.example.com/','http://notably.no/','https://www.notably.no/admin']){
  test(`no production API or SDK use on ${url}`,async()=>{
    const e=browser(url,'granted');cleanup=startMarketingScriptsLoader();await settle();initMarketingTracking();
    assert.equal(e.document.querySelectorAll('script[src]').length,0);assert.equal(e.f.calls.length,0);
  });
}

test('unknown query content cannot be inspected by provider SDKs',async()=>{
  const e=browser('https://www.notably.no/?email=private%40example.test','granted');cleanup=startMarketingScriptsLoader();await settle();
  assert.equal(e.document.querySelectorAll('script[src]').length,0);trackStartTrialClick({button_id:'hero',page_path:'/'});
  assert.equal(e.window.dataLayer?.some(x=>x[0]==='event')??false,false);
});

test('leaving a public route revokes both provider purposes even when server consent remains granted',async()=>{
  const e=browser('https://www.notably.no/','granted');cleanup=startMarketingScriptsLoader();await settle();
  e.window.history.pushState({},'', '/admin');e.window.dispatchEvent(new Event('focus'));await settle();
  const consent=e.window.dataLayer.filter(x=>x[0]==='consent').at(-1)[2];
  assert.equal(consent.analytics_storage,'denied');assert.equal(consent.ad_storage,'denied');assert.equal(consent.ad_user_data,'denied');
  assert.deepEqual(e.window.fbq.queue.at(-1),['consent','revoke']);assert.equal(e.window['ga-disable-G-NJRML2BKQP'],true);
});

test('Google auxiliary URL fields and valid campaign fields are accepted without admitting arbitrary query data',()=>{
  assert.equal(isSafeProviderPage(new URL('https://www.notably.no/?gad_source=1&gad_campaignid=123&gclid=OFFLINE_CLICK')),true);
  assert.equal(isSafeProviderPage(new URL('https://www.notably.no/?gclid=first&gclid=second')),false);
  assert.equal(isSafeProviderPage(new URL('https://www.notably.no/?gad_source=private-data')),false);
});

test('only validated single identifiers and UTM fields enter source payload or exact signup links',()=>{
  const input=readAttribution(new URL('https://www.notably.no/bygg-og-anlegg?gclid=one&gclid=two&gbraid=OFFLINE_BRAID&wbraid=%3Cbad%3E&utm_source=google&email=private'), '_fbp=fb.1.1700000000000.1234; _fbc=malformed');
  assert.deepEqual(input.identifiers,{gbraid:'OFFLINE_BRAID',fbp:'fb.1.1700000000000.1234'});
  assert.deepEqual(input.utm,{utm_source:'google'});assert.equal(input.sourceUrl,'https://www.notably.no/bygg-og-anlegg');assert.equal(canCaptureSource(input),true);
  const link=decorateSignup('https://app.notably.no/no/sign-up?gclid=stale',input,'sales_1');
  assert.equal(new URL(link).searchParams.has('gclid'),false);assert.equal(new URL(link).searchParams.has('fbp'),false);assert.match(link,/gbraid=OFFLINE_BRAID/);
  for(const target of ['https://app.notably.no.evil.test/no/sign-up','https://app.notably.no/no/dashboard','https://test.notably.no/no/sign-up'])assert.equal(decorateSignup(target,input,'sales_1'),target);
  assert.equal(canCaptureSource(readAttribution(new URL('https://www.notably.no/artikler/example?gclid=OFFLINE_CLICK'))),false);
});

test('synthetic DOM clicks do not create production intent events',async()=>{
  const e=browser('https://www.notably.no/','granted');cleanup=startMarketingScriptsLoader();await settle();
  e.document.querySelector('#cta').dispatchEvent(new e.window.MouseEvent('click',{bubbles:true}));
  assert.equal(e.window.dataLayer.some(x=>x[0]==='event'&&x[1]==='start_trial_click'),false);
});

// Exercise the delegated handler with a trusted-event fixture. Browser security's
// read-only isTrusted flag is never changed in production or in a real browser.
test('delegation counts left, keyboard and middle activations once, ignores prevented and right clicks',async()=>{
  const e=browser('https://www.notably.no/','granted');let click,aux;
  const add=e.document.addEventListener.bind(e.document);
  e.document.addEventListener=(type,listener,...rest)=>{if(type==='click')click=listener;if(type==='auxclick')aux=listener;return add(type,listener,...rest);};
  cleanup=startMarketingScriptsLoader();await settle();
  const base={isTrusted:true,defaultPrevented:false,target:e.document.querySelector('#cta span'),button:0,type:'click'};
  click(base); // left click or keyboard Enter both produce click/button 0
  aux({...base,type:'auxclick',button:1});
  aux({...base,type:'auxclick',button:2});
  click({...base,defaultPrevented:true});
  click({...base,isTrusted:false});
  assert.equal(e.window.dataLayer.filter(x=>x[0]==='event'&&x[1]==='start_trial_click').length,2);
  assert.equal(e.window.fbq.queue.filter(x=>x[0]==='trackSingleCustom').length,2);
  await settle();
});

for (const permissions of [{analytics:true,advertising:false},{analytics:false,advertising:true},{analytics:true,advertising:true},{analytics:false,advertising:false}]) {
  test(`SDK and CTA destinations follow each purpose: ${JSON.stringify(permissions)}`,async()=>{
    const e=browser('https://www.notably.no/?gclid=OFFLINE_PURPOSE&ref=sales_1');e.f.setPermissions(permissions);
    cleanup=startMarketingScriptsLoader();await settle();
    assert.equal(e.window.dataLayer?.some(x=>x[0]==='config'&&x[1]==='G-NJRML2BKQP')??false,permissions.analytics);
    assert.equal(e.window.dataLayer?.some(x=>x[0]==='config'&&x[1]==='AW-17626822366')??false,permissions.advertising);
    assert.equal(e.document.querySelectorAll('#notably-google-script').length,permissions.analytics||permissions.advertising?1:0);
    assert.equal(!!e.document.querySelector('#notably-fb-script'),permissions.advertising);
    assert.equal(!!e.window.ttq,permissions.advertising);
    assert.equal(e.f.calls.some(x=>x.url.endsWith('/attribution')),permissions.advertising);
    assert.equal(new URL(e.document.querySelector('#cta').href).searchParams.has('gclid'),permissions.advertising);
    assert.equal(new URL(e.document.querySelector('#cta').href).searchParams.get('ref'),'sales_1');
    trackStartTrialClick({button_id:'hero',page_path:'/'});
    assert.equal(e.window.dataLayer?.some(x=>x[0]==='event'&&x[1]==='start_trial_click')??false,permissions.analytics);
    assert.equal(e.window.fbq?.queue.some(x=>x[0]==='trackSingleCustom')??false,permissions.advertising);
    assert.equal(e.window.dataLayer?.some(x=>x[0]==='event'&&x[1]==='conversion')??false,permissions.advertising);
    if(permissions.analytics&&!permissions.advertising){
      assert.equal(e.window.location.search,'');
      const config=e.window.dataLayer.find(x=>x[0]==='config');assert.equal(config[2].page_location,'https://www.notably.no/');
      const consent=e.window.dataLayer.filter(x=>x[0]==='consent').at(-1)[2];assert.equal(consent.ad_user_data,'denied');assert.equal(consent.analytics_storage,'granted');
    }
  });
}

test('analytics-only consent still measures trusted CTA activations without ad events',async()=>{
  const e=browser();e.f.setPermissions({analytics:true,advertising:false});let click;
  const add=e.document.addEventListener.bind(e.document);e.document.addEventListener=(type,fn,...args)=>{if(type==='click')click=fn;return add(type,fn,...args);};
  cleanup=startMarketingScriptsLoader();await settle();
  click({isTrusted:true,defaultPrevented:false,target:e.document.querySelector('#cta span'),button:0,type:'click'});
  assert.equal(e.window.dataLayer.filter(x=>x[0]==='event'&&x[1]==='start_trial_click').length,1);assert.equal(e.window.fbq,undefined);
});

test('partial revocation keeps cookies for the permission that remains granted',async()=>{
  const e=browser('https://www.notably.no/','granted');cleanup=startMarketingScriptsLoader();await settle();
  e.document.cookie='_ga=analytics-client; Path=/';e.document.cookie='_fbp=fb.1.1700000000000.123; Path=/';
  await consentClient.choose({analytics:true,advertising:false});
  assert.match(e.document.cookie,/_ga=analytics-client/);assert.doesNotMatch(e.document.cookie,/_fbp=/);
  const before=e.window.fbq.queue.length;trackStartTrialClick({button_id:'hero',page_path:'/'});assert.equal(e.window.fbq.queue.length,before);
});
