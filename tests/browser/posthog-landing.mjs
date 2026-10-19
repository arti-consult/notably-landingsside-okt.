// Offline integration QA. All conversion/booking/event delivery is intercepted.
// Requires a locally installed Playwright browser. No production files are changed.
// The served SDK config bypasses automated-browser filtering only inside this test.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
import { fixture } from '../helpers/consent-fixture.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const here = resolve(process.env.POSTHOG_QA_OUTPUT || '/tmp/notably-posthog-qa');
await mkdir(here, { recursive: true });
const baseline = process.argv.includes('--baseline');
if (baseline && !process.env.POSTHOG_QA_BASELINE_DIST) throw new Error('Set POSTHOG_QA_BASELINE_DIST to an already built baseline dist');
const dist = baseline ? resolve(process.env.POSTHOG_QA_BASELINE_DIST) : resolve(root, 'dist');
const browser = await chromium.launch({ headless: true });
const reports = [];
const mime = { '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2', '.html':'text/html', '.json':'application/json' };
const id = 'd7f45c9a-12a8-4d9a-9412-11b200982ee3';
const message = { type:'notably:booking', status:'booked', start:'2026-10-20T08:00:00.000Z', confirmation:{version:1,id} };
function decode(request) {
  const buf = request.postDataBuffer(); if (!buf) return null;
  try { return JSON.parse(buf[0] === 0x1f ? gunzipSync(buf).toString() : buf.toString()); } catch {
    try { const params = new URLSearchParams(buf.toString()); return JSON.parse(Buffer.from(params.get('data'), 'base64').toString()); } catch { return { undecoded:true, bytes:buf.length, prefix:buf.toString().slice(0,120) }; }
  }
}
async function scenario(name, permissions, {old=false, mobile=false, blocked=false, unsafe=false}={}) {
  const context = await browser.newContext({ viewport: mobile ? {width:390,height:844} : {width:1440,height:1000}, reducedMotion:'reduce', userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
  const f = fixture(old ? 'granted' : 'unset');
  const phRequests=[], denied=[], errors=[], logs=[]; const consentDates=new Map(); let consentOffline=false;
  // Emulate a human browser for the SDK's bot filter; all event delivery stays intercepted.
  await context.addInitScript(() => Object.defineProperty(navigator, 'webdriver', {get:()=>false}));
  const page = await context.newPage();
  page.on('pageerror', e=>errors.push(e.message));
  page.on('console', m=>{ if(m.type()==='error'||m.type()==='warning')logs.push(m.text()); });
  await context.route('**/*', async route => {
    const request=route.request(), url=new URL(request.url());
    if (url.hostname==='www.notably.no') {
      if(blocked && /assets\/module-/.test(url.pathname))return route.abort();
      let path=resolve(dist, '.'+decodeURIComponent(url.pathname));
      if (!path.startsWith(dist)) return route.abort();
      try { let body=await readFile(path);if(path.endsWith('.js'))body=Buffer.from(body.toString().replace('capture_pageview:!1,capture_pageleave:!0', 'opt_out_useragent_filter:!0,capture_pageview:!1,capture_pageleave:!0'));  return route.fulfill({status:200,body,contentType:mime[extname(path)]||'application/octet-stream'}); }
      catch { if(extname(url.pathname)){console.log('missing local',url.pathname);return route.fulfill({status:404,body:''});} return route.fulfill({status:200,body:await readFile(resolve(dist,'index.html')),contentType:'text/html'}); }
    }
    if (url.hostname==='api.notably.no') {
      const headers={'access-control-allow-origin':'https://www.notably.no','access-control-allow-credentials':'true','access-control-allow-headers':'content-type,x-notably-consent-csrf','access-control-allow-methods':'GET,POST,OPTIONS'};
      if(request.method()==='OPTIONS')return route.fulfill({status:204,headers});
      if(consentOffline)return route.fulfill({status:503,headers,body:'offline QA'});
      const h=request.headers(); h['X-Notably-Consent-CSRF']=h['x-notably-consent-csrf'];
      const response=await f.fetch(request.url(),{method:request.method(),headers:h,body:request.postData()});
      const data=await response.json(); if(data.consent){const c=data.consent; if(!consentDates.has(c.revision))consentDates.set(c.revision,{decidedAt:c.decidedAt,expiresAt:c.expiresAt});Object.assign(c,consentDates.get(c.revision));} return route.fulfill({status:response.status,body:JSON.stringify(data),contentType:'application/json',headers});
    }
    if (url.hostname==='os.notably.no') {
      const html=`<!doctype html><meta charset="utf-8"><body><p>PRIVATE_BOOKING_DETAILS</p><input placeholder="E-post" value="private@example.test"><button id="confirm">Bekreft møtet</button><script>parent.postMessage({type:'notably:booking',status:'ready'},'https://www.notably.no');document.querySelector('#confirm').onclick=()=>{parent.postMessage(${JSON.stringify(message)},'https://www.notably.no');parent.postMessage(${JSON.stringify(message)},'https://www.notably.no');};</script></body>`;
      return route.fulfill({status:200,body:html,contentType:'text/html'});
    }
    if (url.hostname==='app.notably.no') return route.fulfill({status:200,body:'Signup navigation intercepted by QA',contentType:'text/html'});
    if (url.hostname.endsWith('posthog.com')) {
      phRequests.push({url:request.url(),method:request.method(),data:decode(request)});
      if(blocked)return route.abort();
      if(request.method()==='POST')return route.fulfill({status:200,body:JSON.stringify({status:1,featureFlags:{},featureFlagPayloads:{}}),contentType:'application/json',headers:{'access-control-allow-origin':'*'}});
      // Only fetch public SDK/config assets. Never forward event payloads.
      const response=await route.fetch();
      let body=await response.text();
      if(url.pathname.includes('/config'))body=body.replace(/"sampleRate":"[^"]+"/g,'"sampleRate":"1"').replace(/"minimumDurationMilliseconds":\d+/g,'"minimumDurationMilliseconds":0');
      return route.fulfill({response,body});
    }
    // Keep all advertising requests offline. App-created queues remain observable.
    denied.push({url:request.url(),method:request.method()});
    return route.fulfill({status:200,body:request.resourceType()==='script'?'/* QA: provider delivery disabled */':'',contentType:request.resourceType()==='script'?'application/javascript':'text/plain'});
  });
  await page.goto('https://www.notably.no/'+(unsafe?'?email=private@example.test':'?utm_source=google&utm_medium=cpc&utm_campaign=accountants&gclid=PRIVATE_AD_ID&ref=qa'));
  await page.getByRole('link',{name:/Book en demo/i}).first().waitFor();
  await page.waitForTimeout(800);
  assert.equal(phRequests.length,0,`${name}: no PostHog before new consent`);
  if(mobile)await page.screenshot({path:resolve(here,'mobile-consent-banner.png')});
  if(!old) {
    if(permissions.analytics&&permissions.advertising)await page.getByRole('button',{name:'Aksepter alle',exact:true}).click();
    else if(!permissions.analytics&&!permissions.advertising)await page.getByRole('button',{name:'Avvis alle',exact:true}).click();
    else {
      await page.getByRole('button',{name:'Tilpass valg',exact:true}).click();
      const inputs=page.locator('input[type=checkbox]');
      if(permissions.analytics)await inputs.nth(0).check();
      if(permissions.advertising)await inputs.nth(1).check();
      await page.getByRole('button',{name:/Lagre valgte|Lagre valg/}).click();
    }
  }
  await page.waitForTimeout(2500);
  if(mobile)await page.screenshot({path:resolve(here,`${name}-mobile.png`),fullPage:false});
  await page.getByRole('link',{name:/Book en demo/i}).first().click();
  await page.waitForTimeout(300);
  await page.screenshot({path:resolve(here,`${baseline?'baseline':'current'}-${name}-modal.png`)});
  await writeFile(resolve(here,`${baseline?'baseline':'current'}-${name}-debug.json`),JSON.stringify({frames:page.frames().map(f=>f.url()),errors,logs,phRequests,body:(await page.locator('body').innerText()).slice(-2000)},null,2));
  await page.frameLocator('iframe[title="Book en demo med Notably"]').getByRole('button',{name:'Bekreft møtet'}).click();
  await page.waitForTimeout(300);
  await page.getByRole('button',{name:'Lukk',exact:true}).click();
  // Reopen and repeat the same confirmation: the existing deduper must still win.
  await page.getByRole('link',{name:/Book en demo/i}).first().click();
  await page.frameLocator('iframe[title="Book en demo med Notably"]').getByRole('button',{name:'Bekreft møtet'}).click();
  await page.getByRole('button',{name:'Lukk',exact:true}).click();
  await page.getByRole('link',{name:/Start gratis/i}).first().click();
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0,600); await page.mouse.click(50,100);
  await page.waitForTimeout(2200);
  const tracking=await page.evaluate(()=>({dataLayer:window.dataLayer||[],meta:window.fbq?.queue||[],storage:Object.keys(sessionStorage),local:Object.entries(localStorage),observed:window.qaEvents}));
  const flattened=phRequests.flatMap(r=>Array.isArray(r.data)?r.data:Array.isArray(r.data?.batch)?r.data.batch:r.data?[r.data]:[]).filter(Boolean);
  await writeFile(resolve(here,`${baseline?'baseline':'current'}-${name}-raw.json`),JSON.stringify({phRequests,tracking,errors,logs},null,2));
  const events=flattened.filter(e=>e.event);
  const decodeNested=value=>{if(typeof value==='string'&&value.startsWith('\x1f\x8b'))return decodeNested(JSON.parse(gunzipSync(Buffer.from(value,'latin1')).toString()));if(Array.isArray(value))return value.map(decodeNested);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,decodeNested(v)]));return value;};
  const expected=permissions.analytics&&!old&&!blocked&&!unsafe;
  if(expected) {
    assert.equal(events.filter(e=>e.event==='$pageview').length,1,`${name}: exactly one pageview; requests=${JSON.stringify(phRequests.map(r=>({url:r.url,data:r.data}))).slice(0,2500)}`);
    assert.ok(events.some(e=>e.event==='$$heatmap'&&Object.keys(e.properties.$heatmap_data||{}).length),`${name}: heatmap coordinates emitted`);
    assert.equal(events.filter(e=>e.event==='demo_click').length,2,`${name}: demo clicks`);
    assert.equal(events.filter(e=>e.event==='demo_booked').length,1,`${name}: deduped confirmed booking`);
    assert.equal(events.filter(e=>e.event==='start_trial_click').length,1,`${name}: trial intent`);
    if(!baseline) {
      assert.ok(events.some(e=>e.event==='$autocapture'&&e.properties.$elements_chain),'native element clickmap receives structural clicks');
      assert.ok(events.some(e=>e.event==='$web_vitals'&&typeof e.properties.$web_vitals_LCP_value==='number'),'native web vitals receive numeric performance');
    }
    assert.doesNotMatch(JSON.stringify(decodeNested(phRequests.filter(r=>r.method==='POST'))),/PRIVATE_AD_ID|PRIVATE_BOOKING_DETAILS|private@example|gclid=/,`${name}: privacy`);
  } else assert.equal(events.length,0,`${name}: no captured PostHog events`);
  if(!permissions.analytics||old||unsafe)assert.equal(phRequests.length,0,`${name}: no PostHog requests`);
  assert.equal(errors.length,0,`${name}: browser exceptions: ${errors.join(', ')}`);
  const ga=tracking.dataLayer.filter(x=>x[0]==='event');
  const meta=tracking.meta.filter(x=>x[0]==='trackSingleCustom');
  const normalize=values=>JSON.parse(JSON.stringify(values).replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,'UUID'));
  const report={name,ga:normalize(ga),meta:normalize(meta),events:events.map(e=>({event:e.event,properties:e.properties})),posthogRequests:phRequests.map(r=>({url:r.url,method:r.method,undecoded:r.data?.undecoded})),storage:tracking.storage,local:tracking.local,errors,logs};
  if(expected && name==='both') {
    const allEvents=()=>phRequests.flatMap(r=>Array.isArray(r.data)?r.data:Array.isArray(r.data?.batch)?r.data.batch:r.data?[r.data]:[]);
    if(!baseline) {
      await page.getByRole('link',{name:'Priser',exact:true}).first().click();
      await page.locator('#pricing').scrollIntoViewIfNeeded();await page.waitForTimeout(5800);
      assert.equal(allEvents().filter(e=>e.event==='section_viewed'&&e.properties.section_id==='pricing').length,1,'pricing viewed once');
      assert.equal(allEvents().filter(e=>e.event==='section_engaged'&&e.properties.section_id==='pricing').length,1,'pricing has five seconds of visible attention');
      await page.getByRole('button',{name:'Snakk med oss',exact:true}).click();
      await page.getByRole('button',{name:'Lukk',exact:true}).click();
      assert.equal(allEvents().filter(e=>e.event==='contact_click'&&e.properties.contact_type==='enterprise_open').length,1,'enterprise contact intent');
      await page.getByRole('link',{name:/Regnskapsførere/i}).first().click();
      await page.locator('#kalkulator').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
      const slider=page.locator('#kalkulator input[type=range]').first();await slider.focus();await slider.press('ArrowRight');await slider.press('ArrowRight');
      await page.locator('#faq button[aria-expanded]').nth(1).click();
      await page.locator('#faq button[aria-expanded]').nth(1).click();
      await page.locator('#faq button[aria-expanded]').nth(1).click();await page.waitForTimeout(1000);
      assert.equal(allEvents().filter(e=>e.event==='calculator_used').length,1,'calculator use deduplicated and no values');
      assert.equal(allEvents().filter(e=>e.event==='faq_opened'&&e.properties.question_id==='question-2').length,1,'FAQ opening deduplicated');
      assert.ok(allEvents().some(e=>e.event==='$pageleave'&&e.properties.$prev_pageview_max_content_percentage>0.5),'native scrollmap has content depth');
      assert.doesNotMatch(JSON.stringify(decodeNested(phRequests.filter(r=>r.method==='POST'))),/PRIVATE_AD_ID|PRIVATE_BOOKING_DETAILS|private@example|gclid=/,'all engagement payloads remain private');
      report.engagement={pricingView:true,attention:true,contact:true,calculator:true,faq:true,scrollDepth:true,nativeClickmap:true,webVitals:true};
    }
    await page.getByRole('link',{name:'Om oss',exact:true}).first().click(); await page.waitForTimeout(1000);
    assert.ok(allEvents().some(e=>e.event==='$pageleave'&&e.properties.$pathname==='/'), 'route emits leave for previous page');
    assert.equal(allEvents().filter(e=>e.event==='$pageview'&&e.properties.$pathname==='/om-oss').length,1,'route emits one new pageview');
    await page.getByRole('button',{name:'Personvernvalg',exact:true}).click();
    await page.locator('input[type=checkbox]').nth(0).uncheck();
    consentOffline=true;
    await page.getByRole('button',{name:'Lagre valg',exact:true}).click();
    const beforeRevoked=phRequests.length; await page.waitForTimeout(2000);
    assert.equal(phRequests.length,beforeRevoked,'no PostHog request after offline withdrawal');
    const remaining=await page.evaluate(()=>({session:Object.keys(sessionStorage),receipt:localStorage.getItem('notably.posthog-disclosure:v1')}));
    assert.equal(remaining.receipt,null,'disclosure receipt removed immediately');
    assert.ok(!remaining.session.includes('ph_notably_landing'),'active PostHog persistence cleared');
    await page.reload();await page.waitForTimeout(1600);
    assert.equal(phRequests.length,beforeRevoked,'offline reload does not start PostHog');
    report.withdrawal={offline:true,stoppedImmediately:true,reloadStopped:true,remainingStorage:remaining.session};
    report.routePageviewsVerified=true;
  }
  reports.push(report);
  await writeFile(resolve(here,`${baseline?'baseline':'current'}-${name}.json`),JSON.stringify({report,phRequests},null,2));
  console.log(`${name}: PASS; GA events=${ga.length}; Meta events=${meta.length}; PostHog=${events.map(e=>e.event).join(', ')}`);
  await context.close();
}
try {
  const filter=process.env.QA_CASE;
  for(const [name,p,options] of [
    ['both',{analytics:true,advertising:true},{}],
    ['analytics-only',{analytics:true,advertising:false},{}],
    ['advertising-only',{analytics:false,advertising:true},{}],
    ['denied',{analytics:false,advertising:false},{}],
    ['existing-grant',{analytics:true,advertising:true},{old:true}],
    ['mobile',{analytics:true,advertising:true},{mobile:true}],
    ['blocked-sdk',{analytics:true,advertising:true},{blocked:true}],
    ['unsafe-url',{analytics:true,advertising:true},{unsafe:true}],
  ])if(!filter||filter===name)await scenario(name,p,options);
  if(!filter)await writeFile(resolve(here,`${baseline?'baseline':'current'}-browser-report.json`),JSON.stringify(reports,null,2));
} finally {await browser.close();}
