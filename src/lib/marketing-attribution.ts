import type { Attribution } from './consent-client.ts';
import { ACQUISITION_PATHS, CAMPAIGN_KEYS, CLICK_ID, isProductionPage, normalizeRef, publicPagePath, validCampaignValue } from './marketing-policy.ts';

/** Call only after server-confirmed consent. No IDs are put in browser storage. */
export function readAttribution(url: URL, cookie = ''): Attribution | null {
  if (!isProductionPage(url)) return null;
  const identifiers: Attribution['identifiers'] = {};
  const utm: NonNullable<Attribution['utm']> = {};
  for (const key of CAMPAIGN_KEYS) {
    const values = url.searchParams.getAll(key);
    if (values.length !== 1 || !validCampaignValue(key, values[0])) continue;
    if (key.startsWith('utm_')) utm[key as keyof typeof utm] = values[0];
    else identifiers[key as keyof typeof identifiers] = values[0];
  }
  for (const [name, field] of [['_fbc', 'fbc'], ['_fbp', 'fbp']] as const) {
    const values = cookie.split(';').map(x => x.trim()).filter(x => x.startsWith(`${name}=`));
    if (values.length !== 1) continue;
    try {
      const value = decodeURIComponent(values[0].slice(name.length + 1));
      if (value.length <= 512 && /^fb\.\d{1,3}\.\d{10,16}\.[A-Za-z0-9._~-]+$/.test(value) && (field !== 'fbp' || /^fb\.\d{1,3}\.\d{10,16}\.\d{1,20}$/.test(value))) identifiers[field] = value;
    } catch { /* Ignore malformed cookie encodings. */ }
  }
  if (!Object.keys(identifiers).length && !Object.keys(utm).length) return null;
  return { sourceUrl: `${url.origin}${publicPagePath(url)}`, identifiers, ...(Object.keys(utm).length ? { utm } : {}) };
}

export function canCaptureSource(input: Attribution): boolean {
  return ACQUISITION_PATHS.has(new URL(input.sourceUrl).pathname);
}

export function withoutCampaign(url: URL): URL {
  const result = new URL(url);
  for (const key of CAMPAIGN_KEYS) result.searchParams.delete(key);
  return result;
}

export function signupDestination(href: string): URL | null {
  try {
    const url = new URL(href);
    return url.origin === 'https://app.notably.no' && /^\/(no|en)\/sign-up\/?$/.test(url.pathname) && !url.username && !url.password ? url : null;
  } catch { return null; }
}

/** Organic origin of the visit in the standard GA convention: `google / organic`, `linkedin / organic`, `direct / none`. Only this label leaves the browser, never the referrer URL. */
export type Origin = { source: string; medium: 'organic' | 'none' };
const host = (h: string, ...names: string[]) => names.some(n => h === n || h.endsWith(`.${n}`));
const SOURCES: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['bing', ['bing.com']], ['duckduckgo', ['duckduckgo.com']], ['ecosia', ['ecosia.org']], ['startpage', ['startpage.com']], ['brave', ['search.brave.com']], ['yahoo', ['yahoo.com']], ['kagi', ['kagi.com']],
  ['linkedin', ['linkedin.com', 'lnkd.in']],
  ['chatgpt.com', ['chatgpt.com', 'chat.openai.com']], ['perplexity', ['perplexity.ai']], ['claude', ['claude.ai']], ['gemini', ['gemini.google.com']], ['copilot', ['copilot.microsoft.com']],
  ['facebook', ['facebook.com']], ['instagram', ['instagram.com']], ['x', ['x.com', 't.co', 'twitter.com']], ['threads', ['threads.net']], ['reddit', ['reddit.com']], ['tiktok', ['tiktok.com']],
];

/** null = own domains (e.g. back from the app): not a new source. No referrer = direct. Search engines/LinkedIn/AI/social get a short source name; other sites = `referral`. */
export function classifyReferrer(referrer: string | null | undefined): Origin | null {
  const direct: Origin = { source: 'direct', medium: 'none' };
  if (!referrer) return direct;
  let h: string;
  try { const u = new URL(referrer); if (!/^https?:$/.test(u.protocol)) return direct; h = u.hostname.toLowerCase(); } catch { return direct; }
  if (host(h, 'notably.no')) return null;
  if (/^(www\.)?google\.[a-z.]{2,6}$/.test(h)) return { source: 'google', medium: 'organic' };
  for (const [source, hosts] of SOURCES) if (host(h, ...hosts)) return { source, medium: 'organic' };
  return { source: 'referral', medium: 'organic' };
}

/** First page view of the visit, read once at load (memory only). Explicit tagging (utm_source or a click id in the URL) always wins, so no origin is derived then. */
export function readOrigin(url: URL, referrer: string | null | undefined): Origin | null {
  if (!isProductionPage(url)) return null;
  if (['utm_source', 'gclid', 'gbraid', 'wbraid', 'fbclid'].some(k => url.searchParams.has(k))) return null;
  return classifyReferrer(referrer);
}

export function decorateSignup(href: string, input: Attribution | null, salesRef: string | null, origin: Origin | null = null): string {
  const url = signupDestination(href);
  if (!url) return href;
  // Query forwarding is a consented fallback, not a transfer of the consent capability.
  for (const key of CAMPAIGN_KEYS) url.searchParams.delete(key);
  if (input) {
    for (const key of ['gclid', 'gbraid', 'wbraid', 'fbclid'] as const) {
      const value = input.identifiers[key];
      if (value && CLICK_ID.test(value)) url.searchParams.set(key, value);
    }
    for (const [key, value] of Object.entries(input.utm ?? {})) if ((CAMPAIGN_KEYS as readonly string[]).includes(key) && key.startsWith('utm_') && value && validCampaignValue(key, value)) url.searchParams.set(key, value);
  }
  // Organic fallback with the same (advertising) consent as UTM/click ids (the caller passes null without it). Only standard utm_* keys: the app rejects unknown sign-up params.
  if (origin && !url.searchParams.has('utm_source') && !['gclid', 'gbraid', 'wbraid', 'fbclid'].some(k => url.searchParams.has(k))) {
    url.searchParams.set('utm_source', origin.source); url.searchParams.set('utm_medium', origin.medium);
  }
  const ref = normalizeRef(salesRef);
  if (!url.searchParams.has('ref') && ref) url.searchParams.set('ref', ref);
  return url.href;
}

export function demoDestination(href: string): URL | null {
  try {
    const url = new URL(href);
    return url.origin === 'https://os.notably.no' && /^\/book\/demo\/?$/.test(url.pathname) && !url.username && !url.password ? url : null;
  } catch { return null; }
}

/** «Book en demo»: samme regel som påmeldingslenkene – klikk-id-er/utm bare med samtykke, ref alltid (validert). */
export function decorateDemo(href: string, input: Attribution | null, ref: string | null): string {
  const url = demoDestination(href);
  if (!url) return href;
  for (const key of [...CAMPAIGN_KEYS, 'ref']) url.searchParams.delete(key);
  if (input) {
    for (const key of ['gclid', 'gbraid', 'wbraid', 'fbclid'] as const) {
      const value = input.identifiers[key];
      if (value && CLICK_ID.test(value)) url.searchParams.set(key, value);
    }
    for (const [key, value] of Object.entries(input.utm ?? {})) if ((CAMPAIGN_KEYS as readonly string[]).includes(key) && key.startsWith('utm_') && value && validCampaignValue(key, value)) url.searchParams.set(key, value);
  }
  const r = normalizeRef(ref);
  if (r) url.searchParams.set('ref', r);
  return url.href;
}

/** Attribusjon til leadinntaket (venteliste): utm/klikk-id-er bare med samtykke, ref alltid (validert). */
export function leadAttribution(url: URL, consented: boolean): Record<string, string> {
  const out: Record<string, string> = {};
  const input = consented ? readAttribution(url) : null;
  if (input) {
    for (const key of ['gclid', 'gbraid', 'wbraid', 'fbclid'] as const) if (input.identifiers[key]) out[key] = input.identifiers[key]!;
    for (const [key, value] of Object.entries(input.utm ?? {})) if (value) out[key] = value;
  }
  const refs = url.searchParams.getAll('ref');
  const ref = refs.length === 1 ? normalizeRef(refs[0]) : null;
  if (ref) out.ref = ref;
  return out;
}
