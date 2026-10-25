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

/** Coarse traffic class of the first page view. Only a class and a public landing path leave the browser, never the referrer URL. */
export const REFERRER_CLASSES = ['search', 'linkedin', 'social', 'ai', 'other', 'direct', 'internal'] as const;
export type ReferrerClass = (typeof REFERRER_CLASSES)[number];
export type Origin = { landingPath: string; referrerClass: ReferrerClass };
const host = (h: string, ...names: string[]) => names.some(n => h === n || h.endsWith(`.${n}`));

/** No/empty referrer = direct. Own domains = internal (e.g. back from the app). Click ids and UTM still win downstream (paid is decided by the app/OS). */
export function classifyReferrer(referrer: string | null | undefined): ReferrerClass {
  if (!referrer) return 'direct';
  let h: string;
  try { const u = new URL(referrer); if (!/^https?:$/.test(u.protocol)) return 'direct'; h = u.hostname.toLowerCase(); } catch { return 'direct'; }
  if (host(h, 'notably.no')) return 'internal';
  if (/^(www\.)?google\.[a-z.]{2,6}$/.test(h) || host(h, 'bing.com', 'duckduckgo.com', 'ecosia.org', 'startpage.com', 'search.brave.com', 'yahoo.com', 'kagi.com')) return 'search';
  if (host(h, 'linkedin.com', 'lnkd.in')) return 'linkedin';
  if (host(h, 'chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'claude.ai', 'gemini.google.com', 'copilot.microsoft.com')) return 'ai';
  if (host(h, 'facebook.com', 'instagram.com', 'l.facebook.com', 't.co', 'x.com', 'twitter.com', 'threads.net', 'youtube.com', 'reddit.com', 'tiktok.com')) return 'social';
  return 'other';
}

/** First page view of the visit: public landing path + referrer class. Call once, at load, with document.referrer. Memory only. */
export function readOrigin(url: URL, referrer: string | null | undefined): Origin | null {
  const landingPath = isProductionPage(url) ? publicPagePath(url) : null;
  return landingPath ? { landingPath, referrerClass: classifyReferrer(referrer) } : null;
}

export function decorateSignup(href: string, input: Attribution | null, salesRef: string | null, origin: Origin | null = null): string {
  const url = signupDestination(href);
  if (!url) return href;
  // Query forwarding is a consented fallback, not a transfer of the consent capability.
  for (const key of [...CAMPAIGN_KEYS, 'landing_path', 'referrer_class']) url.searchParams.delete(key);
  // Organic origin travels with the same (advertising) consent as UTM/click ids: the caller passes null without it.
  if (origin) { url.searchParams.set('landing_path', origin.landingPath); url.searchParams.set('referrer_class', origin.referrerClass); }
  if (input) {
    for (const key of ['gclid', 'gbraid', 'wbraid', 'fbclid'] as const) {
      const value = input.identifiers[key];
      if (value && CLICK_ID.test(value)) url.searchParams.set(key, value);
    }
    for (const [key, value] of Object.entries(input.utm ?? {})) if ((CAMPAIGN_KEYS as readonly string[]).includes(key) && key.startsWith('utm_') && value && validCampaignValue(key, value)) url.searchParams.set(key, value);
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
