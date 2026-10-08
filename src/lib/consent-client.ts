import { CONSENT_API, DISCLOSURE_VERSION } from './marketing-policy.ts';

export type ConsentAction = 'grant' | 'reject' | 'withdraw';
export type ProviderPermissions = Record<'adStorage' | 'adUserData' | 'adPersonalization' | 'analyticsStorage', 'granted' | 'denied'>;
export type ConsentResponse = {
  status: 'success'; enabled: boolean; csrfToken: string;
  consent: {
    contractVersion: '1'; disclosureVersion: string | null; mappingVersion: string | null;
    revision: number; state: 'unset' | 'granted' | 'rejected' | 'withdrawn' | 'expired';
    permissions: { optionalAnalyticsAndMarketing: boolean }; providerPermissions: ProviderPermissions;
    decidedAt: string | null; expiresAt: string | null;
  };
};
export type Attribution = {
  sourceUrl: string;
  identifiers: Partial<Record<'gclid' | 'gbraid' | 'wbraid' | 'fbclid' | 'fbc' | 'fbp', string>>;
  utm?: Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_id' | 'utm_content' | 'utm_term', string>>;
};
type Decision = { requestId: string; action: ConsentAction; expectedRevision?: number; disclosureVersion?: string };
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export const PENDING_DENIAL_KEY = 'notably.marketing-consent:pending-denial:v1';
export const PENDING_DENIAL_COOKIE = 'notably_consent_pending_denial';
const LEGACY_KEY = 'notably.consent.v1';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PERMISSIONS = ['adStorage', 'adUserData', 'adPersonalization', 'analyticsStorage'] as const;

function parseResponse(value: unknown): ConsentResponse {
  const r = value as ConsentResponse | undefined;
  const c = r?.consent;
  if (r?.status !== 'success' || typeof r.enabled !== 'boolean' || typeof r.csrfToken !== 'string' || !r.csrfToken || r.csrfToken.length > 4096 ||
    !c || c.contractVersion !== '1' || !Number.isSafeInteger(c.revision) || c.revision < 0 ||
    !['unset', 'granted', 'rejected', 'withdrawn', 'expired'].includes(c.state) ||
    typeof c.permissions?.optionalAnalyticsAndMarketing !== 'boolean' ||
    !PERMISSIONS.every(key => ['granted', 'denied'].includes(c.providerPermissions?.[key])) ||
    ![c.disclosureVersion, c.mappingVersion, c.decidedAt, c.expiresAt].every(x => x === null || typeof x === 'string')) throw new Error('CONSENT_RESPONSE_INVALID');
  return r;
}

export function effectiveGrant(response: ConsentResponse | null, now = Date.now()): boolean {
  const c = response?.consent;
  return Boolean(response?.enabled && c?.state === 'granted' && c.permissions.optionalAnalyticsAndMarketing &&
    c.disclosureVersion === DISCLOSURE_VERSION && c.mappingVersion === DISCLOSURE_VERSION &&
    c.decidedAt && Date.parse(c.decidedAt) <= now && c.expiresAt && Date.parse(c.expiresAt) > now &&
    c.providerPermissions.adStorage === 'granted' && c.providerPermissions.adUserData === 'granted' &&
    c.providerPermissions.analyticsStorage === 'granted' && c.providerPermissions.adPersonalization === 'denied');
}

export function createConsentClient(options: {
  fetch: typeof fetch; storage: () => Store | null; document: () => Pick<Document, 'cookie'> | null;
  enabled: () => boolean; id?: () => string; now?: () => number;
}) {
  const id = options.id ?? (() => crypto.randomUUID());
  const now = options.now ?? Date.now;
  let response: ConsentResponse | null = null;
  let phase: 'loading' | 'ready' | 'error' | 'disabled' = 'loading';
  let pending: Decision | null = null;
  let migrated = false;
  let choiceRevision = 0;
  let queue: Promise<unknown> = Promise.resolve();
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach(fn => fn());

  function parsePending(raw: string | null): Decision | null {
    try {
      const d = JSON.parse(raw ?? 'null') as Decision | null;
      return d && UUID.test(d.requestId) && ['reject', 'withdraw'].includes(d.action) &&
        (d.expectedRevision === undefined || (Number.isSafeInteger(d.expectedRevision) && d.expectedRevision >= 0))
        ? { requestId: d.requestId, action: d.action, ...(d.expectedRevision === undefined ? {} : { expectedRevision: d.expectedRevision }) } : null;
    } catch { return null; }
  }
  function durableDenial(): Decision | null {
    try { const d = parsePending(options.storage()?.getItem(PENDING_DENIAL_KEY) ?? null); if (d) return d; } catch { /* Try the essential cookie independently. */ }
    try {
      const cookie = options.document()?.cookie.split(';').map(x => x.trim()).find(x => x.startsWith(`${PENDING_DENIAL_COOKIE}=`));
      return parsePending(cookie ? decodeURIComponent(cookie.slice(PENDING_DENIAL_COOKIE.length + 1)) : null);
    } catch { return null; }
  }
  const denial = () => durableDenial() ?? pending;
  function persist(d: Decision) {
    pending = d;
    try { options.storage()?.setItem(PENDING_DENIAL_KEY, JSON.stringify(d)); } catch { /* Cookie fallback. */ }
    try { const doc = options.document(); if (doc) doc.cookie = `${PENDING_DENIAL_COOKIE}=${encodeURIComponent(JSON.stringify(d))}; Path=/; SameSite=Lax; Secure`; } catch { /* Retain the denial in memory. */ }
  }
  function clear(d: Decision) {
    if (denial()?.requestId !== d.requestId) return;
    pending = null;
    try { options.storage()?.removeItem(PENDING_DENIAL_KEY); } catch { /* Clear fallback as well. */ }
    try { const doc = options.document(); if (doc) doc.cookie = `${PENDING_DENIAL_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax; Secure`; } catch { /* Remaining denial fails closed. */ }
  }
  function migrateLegacy() {
    if (migrated) return;
    migrated = true;
    try {
      const old = JSON.parse(options.storage()?.getItem(LEGACY_KEY) ?? 'null');
      if (old?.marketing === 'denied' && !denial()) persist({ requestId: id(), action: 'reject' });
      // A legacy grant is never imported as server authority.
      options.storage()?.removeItem(LEGACY_KEY);
    } catch { /* Never infer a grant from unreadable storage. */ }
  }

  async function request(path = '', body?: object): Promise<unknown> {
    if (!options.enabled()) throw new Error('CONSENT_DISABLED');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const result = await options.fetch(`${CONSENT_API}/v1/consent${path}`, {
        method: body ? 'POST' : 'GET', credentials: 'include', cache: 'no-store', redirect: 'error', signal: controller.signal,
        ...(body ? { keepalive: true, headers: { 'Content-Type': 'application/json', 'X-Notably-Consent-CSRF': response?.csrfToken ?? '' }, body: JSON.stringify(body) } : {}),
      });
      if (!result.ok) throw new Error(`CONSENT_HTTP_${result.status}`);
      return await result.json();
    } finally { clearTimeout(timer); }
  }
  async function post(path: string, body: object): Promise<unknown> {
    try { return await request(path, body); } catch (error) {
      // One retry for a lost response; preserve request ID and payload exactly.
      if (error instanceof Error && (error.message.startsWith('CONSENT_HTTP_') || error.message === 'CONSENT_DISABLED')) throw error;
      return request(path, body);
    }
  }
  async function readServer() { response = parseResponse(await request()); return response; }
  async function syncDenial() {
    let d = denial();
    if (!d || !response) return;
    d = { ...d, expectedRevision: d.expectedRevision ?? response.consent.revision };
    persist(d);
    try { response = parseResponse(await post('', d)); } catch (error) {
      if (!(error instanceof Error) || error.message !== 'CONSENT_HTTP_409') throw error;
      // Denial may move to the current revision. A grant is never automatically replayed over a newer choice.
      await readServer();
      if (denial()?.requestId !== d.requestId) return;
      d = { requestId: id(), action: d.action, expectedRevision: response!.consent.revision };
      persist(d);
      response = parseResponse(await post('', d));
    }
    if (response.consent.state === 'granted' || response.consent.permissions.optionalAnalyticsAndMarketing) throw new Error('CONSENT_DENIAL_NOT_CONFIRMED');
    clear(d);
  }
  async function refreshCurrent() {
    migrateLegacy();
    await readServer();
    await syncDenial();
    phase = 'ready';
    notify();
    return response!;
  }
  function serial<T>(fn: () => Promise<T>): Promise<T> {
    const run = queue.then(async () => {
      try { return await fn(); } catch (error) {
        phase = options.enabled() ? 'error' : 'disabled';
        response = null;
        notify();
        throw error;
      }
    });
    queue = run.catch(() => undefined);
    return run;
  }
  return {
    view: () => ({ response, phase, pendingDenial: denial() !== null, granted: phase === 'ready' && !denial() && effectiveGrant(response, now()) }),
    externalChange() { if (denial()) { ++choiceRevision; notify(); } },
    hasDurableDenial: () => durableDenial() !== null,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    refresh: () => serial(refreshCurrent),
    choose(grant: boolean) {
      const choice = ++choiceRevision;
      migrateLegacy();
      if (!grant) {
        persist({ requestId: id(), action: response?.consent.state === 'granted' ? 'withdraw' : 'reject' });
        notify(); // Suppress tags and pending capture before any outstanding request can finish.
      }
      return serial(async () => {
        await refreshCurrent();
        if (!grant || choice !== choiceRevision) return response!;
        if (!response?.enabled || response.consent.disclosureVersion !== DISCLOSURE_VERSION || response.consent.mappingVersion !== DISCLOSURE_VERSION) throw new Error('CONSENT_POLICY_CHANGED');
        const body = { requestId: id(), action: 'grant', expectedRevision: response.consent.revision, disclosureVersion: DISCLOSURE_VERSION };
        try { response = parseResponse(await post('', body)); } catch (error) {
          if (error instanceof Error && error.message === 'CONSENT_HTTP_409') await readServer();
          throw error;
        }
        phase = 'ready'; notify(); return response;
      });
    },
    capture(input: Attribution) {
      return serial(async () => {
        await refreshCurrent();
        if (denial() || !effectiveGrant(response, now())) return false;
        const body = { ...input, requestId: id(), expectedRevision: response!.consent.revision };
        const result = await post('/attribution', body) as { status?: string; captured?: number };
        if (result.status !== 'success' || !Number.isSafeInteger(result.captured) || result.captured! < 0) throw new Error('ATTRIBUTION_RESPONSE_INVALID');
        return !denial();
      });
    },
  };
}
