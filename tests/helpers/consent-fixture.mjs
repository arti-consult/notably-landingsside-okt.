import { randomUUID } from 'node:crypto';
export const policy = 'trial-2026-10-08-v1';
export function fixture(initial = 'unset') {
  const calls = [], receipts = new Map(), values = new Map();
  let revision = initial === 'unset' ? 0 : 1, state = initial;
  let intercept = null;
  const response = () => ({ status: 'success', enabled: true, csrfToken: 'offline-csrf-token', consent: {
    contractVersion: '1', disclosureVersion: policy, mappingVersion: policy, revision, state,
    permissions: { optionalAnalyticsAndMarketing: state === 'granted' },
    providerPermissions: { adStorage: state === 'granted' ? 'granted' : 'denied', adUserData: state === 'granted' ? 'granted' : 'denied', analyticsStorage: state === 'granted' ? 'granted' : 'denied', adPersonalization: 'denied' },
    decidedAt: state === 'unset' ? null : new Date(Date.now() - 1000).toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString(),
  } });
  const json = (value, status = 200) => new Response(JSON.stringify(value), { status });
  const fetch = async (url, options) => {
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ url, options, body });
    const override = await intercept?.({ url, options, body, response, json });
    if (override) return override;
    if (!body) return json(response());
    if (options.headers['X-Notably-Consent-CSRF'] !== 'offline-csrf-token') return json({}, 403);
    const receipt = receipts.get(body.requestId);
    if (receipt) return json(receipt);
    if (body.expectedRevision !== revision) return json({}, 409);
    if (url.endsWith('/attribution')) {
      if (state !== 'granted') return json({}, 403);
      const result = { status: 'success', captured: Object.keys(body.identifiers).length };
      receipts.set(body.requestId, result); return json(result);
    }
    state = { grant: 'granted', reject: 'rejected', withdraw: 'withdrawn' }[body.action]; revision++;
    const result = response(); receipts.set(body.requestId, result); return json(result);
  };
  const store = { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v), removeItem: k => values.delete(k) };
  const cookies = new Map();
  const doc = { get cookie() { return [...cookies].map(([k,v])=>`${k}=${v}`).join('; '); }, set cookie(v) { const [pair] = v.split(';'); const i = pair.indexOf('='); const k = pair.slice(0,i); if(v.includes('Max-Age=0')) cookies.delete(k); else cookies.set(k,pair.slice(i+1)); } };
  return { calls, values, cookies, store, doc, fetch, response,
    options: { fetch, storage: () => store, document: () => doc, enabled: () => true, id: randomUUID },
    intercept(fn) { intercept = fn; }, setState(next) { state = next; revision++; },
  };
}
export function deferred() { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; }
