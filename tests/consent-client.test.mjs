import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createConsentClient, effectiveGrant, PENDING_DENIAL_KEY } from '../src/lib/consent-client.ts';
import { fixture, deferred } from './helpers/consent-fixture.mjs';

test('old local grant cannot authorize new tracking; explicit grant uses credentialed server CSRF/revision', async () => {
  const f = fixture(); f.values.set('notably.consent.v1', JSON.stringify({ marketing:'granted' }));
  const c = createConsentClient(f.options);
  await c.refresh(); assert.equal(c.view().granted,false); assert.equal(f.values.has('notably.consent.v1'),false);
  await c.choose(true); assert.equal(c.view().granted,true);
  const post = f.calls.find(x=>x.body?.action==='grant');
  assert.equal(post.body.expectedRevision,0); assert.equal(post.body.disclosureVersion,'trial-2026-10-08-v1');
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
