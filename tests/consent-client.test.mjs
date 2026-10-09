import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createConsentClient, effectiveGrant, effectivePermissions, PENDING_DENIAL_KEY } from '../src/lib/consent-client.ts';
import { fixture, deferred } from './helpers/consent-fixture.mjs';

test('old local grant cannot authorize new tracking; explicit grant uses credentialed server CSRF/revision', async () => {
  const f = fixture(); f.values.set('notably.consent.v1', JSON.stringify({ marketing:'granted' }));
  const c = createConsentClient(f.options);
  await c.refresh(); assert.equal(c.view().granted,false); assert.equal(f.values.has('notably.consent.v1'),false);
  await c.choose(true); assert.equal(c.view().granted,true);
  const post = f.calls.find(x=>x.body?.action==='grant');
  assert.equal(post.body.expectedRevision,0); assert.equal(post.body.disclosureVersion,'trial-2026-10-08-v2');
  assert.equal(post.options.headers['X-Notably-Consent-CSRF'],'offline-csrf-token');
  for(const call of f.calls) assert.equal(call.options.credentials,'include');
  assert.equal(f.values.size,0); // No local grant/capability/attribution storage.
});

test('a legacy rejection overrides a server grant', async () => {
  const f=fixture('granted'); f.values.set('notably.consent.v1',JSON.stringify({marketing:'denied'}));
  const c=createConsentClient(f.options); await c.refresh();
  assert.equal(c.view().granted,false); assert.equal(f.response().consent.state,'rejected');
});

test('outage fails closed and remembers rejection across a new client', async () => {
  const f=fixture('granted'); const c=createConsentClient(f.options); await c.refresh();
  f.intercept(()=>{ throw new TypeError('offline'); });
  const rejection=c.choose(false); assert.equal(c.view().granted,false); assert.equal(c.hasDurableDenial(),true);
  await assert.rejects(rejection); assert.equal(c.view().phase,'error');
  f.intercept(null); const next=createConsentClient(f.options); await next.refresh();
  assert.equal(next.view().granted,false); assert.equal(next.view().pendingDenial,false); assert.equal(f.response().consent.state,'withdrawn');
});

test('essential cookie preserves denial if localStorage is blocked', async () => {
  const f=fixture('granted'); const options={...f.options, storage:()=>{throw Error('blocked');}};
  const c=createConsentClient(options); await c.refresh(); f.intercept(()=>{throw Error('offline');});
  await assert.rejects(c.choose(false)); assert.equal(c.hasDurableDenial(),true);
  f.intercept(null); const next=createConsentClient(options); await next.refresh(); assert.equal(next.view().granted,false);
});

test('a lost grant response retries the identical UUID and payload, applying once', async () => {
  const f=fixture(); let lost=false;
  const fetch=async(url,opts)=>{ const result=await f.fetch(url,opts); if(opts.body && JSON.parse(opts.body).action==='grant' && !lost){lost=true;throw Error('response lost');}return result;};
  const c=createConsentClient({...f.options,fetch}); await c.choose(true);
  const posts=f.calls.filter(x=>x.body?.action==='grant');assert.equal(posts.length,2);assert.deepEqual(posts[0].body,posts[1].body);
  assert.equal(c.view().response.consent.revision,1);assert.equal(c.view().granted,true);
});

test('conflicting grant never overwrites a newer server decision', async () => {
  const f=fixture(); f.intercept(({body})=>{if(body?.action==='grant') f.setState('rejected');});
  const c=createConsentClient(f.options);await assert.rejects(c.choose(true),/409/);
  assert.equal(c.view().granted,false);assert.equal(f.calls.filter(x=>x.body?.action==='grant').length,1);
});

test('conflicting denial rebases safely to the latest revision', async () => {
  const f=fixture('granted');let race=true;
  f.intercept(({body})=>{if(body?.action==='withdraw' && race){race=false;f.setState('granted');}});
  const c=createConsentClient(f.options);await c.refresh();await c.choose(false);
  assert.equal(c.view().granted,false);assert.equal(c.view().pendingDenial,false);assert.equal(f.response().consent.state,'withdrawn');
  const posts=f.calls.filter(x=>x.body?.action==='withdraw');assert.equal(posts.length,2);assert.notEqual(posts[0].body.requestId,posts[1].body.requestId);
});

test('withdrawal during an in-flight grant suppresses tracking before either response', async () => {
  const f=fixture(); const entered=deferred(),gate=deferred();
  f.intercept(async({body})=>{if(body?.action==='grant'){entered.resolve();await gate.promise;}});
  const c=createConsentClient(f.options);const grant=c.choose(true);await entered.promise;
  const deny=c.choose(false);assert.equal(c.view().granted,false);
  gate.resolve();await grant;assert.equal(c.view().granted,false);await deny;
  assert.equal(c.view().granted,false);assert.notEqual(f.response().consent.state,'granted');
});

test('queued older grant cannot undo a newer rejection', async () => {
  const f=fixture();const c=createConsentClient(f.options);
  await Promise.all([c.choose(true),c.choose(false)]);
  assert.equal(f.calls.filter(x=>x.body?.action==='grant').length,0);assert.equal(c.view().granted,false);
});

test('denial from another tab cancels an older grant intent', async () => {
  const f=fixture();const entered=deferred(),gate=deferred();let first=true;
  f.intercept(async({body})=>{if(!body && first){first=false;entered.resolve();await gate.promise;}});
  const c=createConsentClient(f.options);const grant=c.choose(true);await entered.promise;
  f.store.setItem(PENDING_DENIAL_KEY,JSON.stringify({requestId:crypto.randomUUID(),action:'reject'}));c.externalChange();gate.resolve();await grant;
  assert.equal(c.view().granted,false);assert.equal(f.calls.filter(x=>x.body?.action==='grant').length,0);
});

test('attribution rechecks consent before writing and never sends after withdrawal', async () => {
  const f=fixture('granted');const c=createConsentClient(f.options);await c.refresh();f.setState('withdrawn');
  assert.equal(await c.capture({sourceUrl:'https://notably.no/',identifiers:{gclid:'OFFLINE_FIXTURE'}}),false);
  assert.equal(f.calls.filter(x=>x.url.endsWith('/attribution')).length,0);
});

test('disabled environments cannot call the API', async () => {
  const f=fixture('granted');const c=createConsentClient({...f.options,enabled:()=>false});
  await assert.rejects(c.choose(true));assert.equal(f.calls.length,0);assert.equal(c.view().granted,false);
});

test('expired, malformed, unknown-policy and personalization-enabled grants all fail closed', async () => {
  for(const change of [r=>r.consent.expiresAt='2000-01-01',r=>r.consent.disclosureVersion='future',r=>r.consent.mappingVersion='future',r=>r.consent.providerPermissions.adPersonalization='granted',r=>r.consent.decidedAt='bad-date']){
    const f=fixture('granted'),r=f.response();change(r);assert.equal(effectiveGrant(r),false);
  }
  const f=fixture();f.intercept(({json})=>json({status:'success'}));const c=createConsentClient(f.options);await assert.rejects(c.refresh(),/INVALID/);assert.equal(c.view().granted,false);
});

test('a freshly saved grant stays selected immediately with 60 ms server clock skew', async () => {
  const now = Date.now(), f = fixture();
  const fetch = async (url, options) => {
    const result = await f.fetch(url, options), body = await result.json();
    if (body.consent?.state === 'granted') body.consent.decidedAt = new Date(now + 60).toISOString();
    return new Response(JSON.stringify(body), { status: result.status });
  };
  const c = createConsentClient({ ...f.options, fetch, now: () => now });
  await c.choose(true);
  assert.equal(c.view().phase, 'ready');
  assert.deepEqual(c.view().permissions, { analytics: true, advertising: true });
  await c.refresh();
  assert.deepEqual(c.view().permissions, { analytics: true, advertising: true });
});

for (const [offset, granted] of [[1000, true], [1001, false]]) {
  test(`decision-time clock tolerance is bounded: ${offset} ms ahead`, () => {
    const now = Date.now(), response = fixture('granted').response();
    response.consent.decidedAt = new Date(now + offset).toISOString();
    assert.deepEqual(effectivePermissions(response, now), { analytics: granted, advertising: granted });
  });
}

test('decision-time tolerance never extends consent expiry', () => {
  const now = Date.now(), response = fixture('granted').response();
  response.consent.decidedAt = new Date(now + 60).toISOString();
  for (const offset of [0, -1]) {
    response.consent.expiresAt = new Date(now + offset).toISOString();
    assert.deepEqual(effectivePermissions(response, now), { analytics: false, advertising: false });
  }
});

test('decision-time tolerance never overrides withdrawal or rejection', () => {
  const now = Date.now(), response = fixture('granted').response();
  response.consent.decidedAt = new Date(now + 60).toISOString();
  for (const state of ['withdrawn', 'rejected', 'expired']) {
    response.consent.state = state;
    assert.deepEqual(effectivePermissions(response, now), { analytics: false, advertising: false });
  }
});

for (const permissions of [{analytics:true,advertising:false},{analytics:false,advertising:true},{analytics:true,advertising:true},{analytics:false,advertising:false}]) {
  test(`server choices remain independent: ${JSON.stringify(permissions)}`, async () => {
    const f=fixture(),c=createConsentClient(f.options);
    await c.choose(permissions);
    assert.deepEqual(c.view().permissions,permissions);
    assert.deepEqual(f.response().consent.permissions,permissions);
    const captured=await c.capture({sourceUrl:'https://notably.no/',identifiers:{gclid:'OFFLINE_MATRIX'}});
    assert.equal(captured,permissions.advertising);
  });
}

test('v1 combined grant never becomes purpose grants; reject-all still works against v1',async()=>{
  const f=fixture('granted');
  const fetch=async(url,options)=>{
    const result=await f.fetch(url,options),r=await result.json();
    if(r.consent){r.consent.contractVersion='1';r.consent.permissions={optionalAnalyticsAndMarketing:r.consent.state==='granted'};r.consent.disclosureVersion=r.consent.mappingVersion='trial-2026-10-08-v1';}
    return new Response(JSON.stringify(r),{status:result.status});
  };
  const c=createConsentClient({...f.options,fetch});await c.refresh();
  assert.deepEqual(c.view().permissions,{analytics:false,advertising:false});assert.equal(c.view().supportsPurposes,false);
  await assert.rejects(c.choose(true),/POLICY_CHANGED/);
  assert.equal(f.calls.filter(x=>x.body?.action==='grant').length,0);
  await c.choose(false);assert.notEqual(f.response().consent.state,'granted');assert.equal(c.view().pendingDenial,false);
});

test('partial offline withdrawal is durable and cannot revoke the other server purpose',async()=>{
  const f=fixture('granted'),c=createConsentClient(f.options);await c.refresh();
  f.intercept(()=>{throw Error('offline');});
  const choice=c.choose({analytics:true,advertising:false});
  assert.deepEqual(c.view().permissions,{analytics:true,advertising:false});
  await assert.rejects(choice);
  const stored=JSON.parse(f.values.get(PENDING_DENIAL_KEY));
  assert.deepEqual(stored.purposes,['advertising']);assert.equal(stored.permissions,undefined);
  f.intercept(null);const next=createConsentClient(f.options);await next.refresh();
  assert.deepEqual(next.view().permissions,{analytics:true,advertising:false});
  assert.equal(f.calls.some(x=>x.body?.action==='grant'),false);
});

test('partial denial conflicts do not regrant a concurrently withdrawn other purpose',async()=>{
  const f=fixture('granted'),c=createConsentClient(f.options);await c.refresh();
  f.intercept(()=>{throw Error('offline');});await assert.rejects(c.choose({analytics:true,advertising:false}));
  let first=true;f.intercept(({body})=>{if(body?.action==='withdraw'&&first){first=false;f.setPermissions({analytics:false,advertising:true});}});
  const next=createConsentClient(f.options);await next.refresh();
  assert.deepEqual(next.view().permissions,{analytics:false,advertising:false});
  const posts=f.calls.filter(x=>x.body?.action==='withdraw');
  assert.deepEqual(posts.at(-1).body.purposes,['advertising']);
});

test('wrong provider mapping cannot authorize one purpose implicitly',async()=>{
  const f=fixture('granted');f.intercept(({response,json})=>{const r=response();r.consent.permissions.advertising=false;return json(r);});
  const c=createConsentClient(f.options);await c.refresh();assert.deepEqual(c.view().permissions,{analytics:false,advertising:false});
});
