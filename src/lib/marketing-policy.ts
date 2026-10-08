/** Public constants only. Provider credentials belong exclusively in the app worker. */
export const CONSENT_API = 'https://api.notably.no';
export const DISCLOSURE_VERSION = 'trial-2026-10-08-v1';
export const GA_MEASUREMENT_ID = 'G-NJRML2BKQP';
export const FB_PIXEL_ID = '1783628368949768';
export const PRODUCTION_ORIGINS = new Set(['https://notably.no', 'https://www.notably.no']);
export const ACQUISITION_PATHS = new Set(['/', '/advokat', '/regnskapsforer', '/bygg-og-anlegg']);
export const CAMPAIGN_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term'] as const;
export const CLICK_ID = /^[A-Za-z0-9._~-]{1,512}$/;
export const validCampaignValue = (key: string, value: string): boolean => key.startsWith('utm_')
  ? value.length > 0 && value.length <= 200 && /^[\x20-\x7e]+$/.test(value) : CLICK_ID.test(value);
export const SALES_REF = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

export function publicPagePath(url: URL): string | null {
  const path = url.pathname.replace(/\/$/, '') || '/';
  return ACQUISITION_PATHS.has(path) || ['/om-oss', '/personvern', '/vilkar', '/artikler'].includes(path) || /^\/artikler\/[a-z0-9-]{1,160}$/.test(path) ? path : null;
}

export function isProductionPage(url = new URL(window.location.href)): boolean {
  return PRODUCTION_ORIGINS.has(url.origin) && publicPagePath(url) !== null;
}

/** Do not let provider SDKs inspect unknown query strings or fragments. */
export function isSafeProviderPage(url = new URL(window.location.href)): boolean {
  if (!isProductionPage(url)) return false;
  for (const [key, value] of url.searchParams) {
    if (url.searchParams.getAll(key).length !== 1) return false;
    if (key === 'ref' && SALES_REF.test(value)) continue;
    if ((CAMPAIGN_KEYS as readonly string[]).includes(key) && validCampaignValue(key, value)) continue;
    if (['gad_source', 'gad_campaignid'].includes(key) && /^\d{1,30}$/.test(value)) continue;
    if (key === 'ttclid' && CLICK_ID.test(value)) continue;
    return false;
  }
  return !url.hash || /^#[a-z][a-z0-9-]{0,63}$/.test(url.hash);
}
