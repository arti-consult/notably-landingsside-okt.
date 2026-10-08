/**
 * Valgfrie analyse- og markedsføringsverktøy.
 *
 * Ingenting her lastes uten et aktivt samtykke fra Personvernvalg – se
 * `src/lib/consent.ts`. `initMarketingTracking()` kalles kun når samtykket er
 * «granted», og `revokeMarketingTracking()` sender revoke-signaler og sletter
 * de markedsføringskapslene vi selv har tilgang til når det trekkes tilbake.
 */

import { hasMarketingConsent } from './consent.ts';

import { FB_PIXEL_ID, GA_MEASUREMENT_ID, isSafeProviderPage, publicPagePath, CAMPAIGN_KEYS } from './marketing-policy.ts';
const TIKTOK_PIXEL_ID = 'D81GS73C77U5V9M1RKG0';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window['fbq'];
    TiktokAnalyticsObject?: string;
    ttq?: any;
  }
}

let marketingInitialized = false;

const appendScript = (id: string, src: string) => {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const ensureGtag = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
};

/** Only server-confirmed consent enables storage; ad personalization stays denied. */
const grantConsentMode = () => {
  ensureGtag();
  window.gtag?.('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });
};

/** Landing SDKs have one owner here. The app keeps GTM; on the landing its
 * remaining Meta PageView would duplicate this page's direct pixel. Attribution
 * is sent to the shared API and explicitly forwarded to signup, without _gl. */
const cleanPageLocation = () => {
  const actual = new URL(window.location.href);
  const clean = new URL(publicPagePath(actual) ?? '/', actual.origin);
  // Preserve genuine campaign attribution in GA's page URL, without arbitrary parameters.
  for (const key of CAMPAIGN_KEYS) {
    const value = actual.searchParams.get(key);
    if (value) clean.searchParams.set(key, value);
  }
  return clean.href;
};
const cleanReferrer = () => {
  try { return document.referrer ? new URL(document.referrer).origin : ''; } catch { return ''; }
};
/** A click is intent only. StartTrial is exclusively the app's Stripe-confirmed event. */
export function trackStartTrialClick(params: { button_id: string; page_path: string }) {
  if (!hasMarketingConsent() || !isSafeProviderPage()) return;
  initMarketingTracking();
  if (!marketingInitialized) return;
  const eventId = crypto.randomUUID();
  window.gtag?.('event', 'start_trial_click', {
    ...params, event_id: eventId, send_to: GA_MEASUREMENT_ID,
    page_location: cleanPageLocation(), page_referrer: cleanReferrer(), transport_type: 'beacon',
  });
  window.fbq?.('trackSingleCustom', FB_PIXEL_ID, 'StartTrialClick', params, { eventID: eventId });
}

const initGoogleAnalytics = () => {
  ensureGtag();

  appendScript('notably-ga-script', `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);

  window.gtag?.('js', new Date());
  window.gtag?.('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: cleanPageLocation(),
    page_referrer: cleanReferrer(),
  });
};

const initMetaPixel = () => {
  if (window.fbq) {
    return;
  }

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }
    fbq.queue?.push(args);
  } as NonNullable<Window['fbq']>;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  window.fbq = fbq;
  window._fbq = fbq;

  appendScript('notably-fb-script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('consent', 'grant');
  window.fbq('init', FB_PIXEL_ID);
  window.fbq('track', 'PageView');
};

const initTikTokPixel = () => {
  if (window.ttq) {
    return;
  }

  (function (w: any, d: Document, t: string) {
    w.TiktokAnalyticsObject = t;
    const ttq = (w[t] = w[t] || []);
    ttq.methods = [
      'page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once',
      'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent',
      'revokeConsent', 'grantConsent',
    ];
    ttq.setAndDefer = function (target: any, method: string) {
      target[method] = function () {
        target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (let i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }
    ttq.instance = function (id: string) {
      const e = ttq._i[id] || [];
      for (let n = 0; n < ttq.methods.length; n++) {
        ttq.setAndDefer(e, ttq.methods[n]);
      }
      return e;
    };
    ttq.load = function (e: string, n?: any) {
      const r = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = r;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      const script = d.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = r + '?sdkid=' + e + '&lib=' + t;
      const first = d.getElementsByTagName('script')[0];
      first.parentNode?.insertBefore(script, first);
    };

    ttq.load(TIKTOK_PIXEL_ID);
    ttq.page();
  })(window, document, 'ttq');
};

export const initMarketingTracking = () => {
  if (
    marketingInitialized ||
    typeof window === 'undefined' ||
    !isSafeProviderPage() ||
    !hasMarketingConsent()
  ) {
    return;
  }

  marketingInitialized = true;
  Object.assign(window, { [`ga-disable-${GA_MEASUREMENT_ID}`]: false });
  grantConsentMode();
  initGoogleAnalytics();
  initMetaPixel();
  initTikTokPixel();
};

export const isMarketingTrackingActive = () => marketingInitialized;

/**
 * Kapsler verktøyene setter på notably.no. Vi kan bare slette kapsler på vårt
 * eget domene – det leverandørene allerede har mottatt, styres av deres vilkår.
 */
const MARKETING_COOKIE_NAMES = ['_gid', '_gcl_au', '_gcl_aw', '_gcl_dc', '_fbp', '_fbc', '_ttp', '_ttclid'];
const MARKETING_COOKIE_PREFIXES = ['_ga', '_gac_', '_gcl_'];

const cookieDomains = (): string[] => {
  const host = window.location.hostname;
  const domains = new Set<string>(['', host]);

  const parts = host.split('.');
  if (parts.length > 2) {
    domains.add(`.${parts.slice(-2).join('.')}`);
  }
  if (parts.length > 1) {
    domains.add(`.${host}`);
  }

  return Array.from(domains);
};

const clearMarketingCookies = () => {
  if (typeof document === 'undefined') return;

  const present = document.cookie
    .split(';')
    .map((entry) => entry.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name));

  const targets = present.filter(
    (name) =>
      MARKETING_COOKIE_NAMES.includes(name) ||
      MARKETING_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix)),
  );

  for (const name of targets) {
    for (const domain of cookieDomains()) {
      const domainPart = domain ? `; domain=${domain}` : '';
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
    }
  }
};

/**
 * Trekker tilbake samtykket: sender revoke-signaler til verktøyene som allerede
 * er lastet, og sletter kjente markedsføringskapsler. Selve skriptene fjernes
 * først ved neste sidelasting, så kalleren laster siden på nytt etterpå.
 */
export const revokeMarketingTracking = () => {
  if (typeof window === 'undefined') return;

  Object.assign(window, { [`ga-disable-${GA_MEASUREMENT_ID}`]: true });
  try {
    window.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
    window.fbq?.('consent', 'revoke');
    window.ttq?.revokeConsent?.();
  } catch {
    // Et verktøy som ikke er lastet skal ikke stoppe resten av tilbaketrekkingen.
  }

  clearMarketingCookies();
  marketingInitialized = false;
};

const readCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
};

const readQueryParam = (name: string): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return new URLSearchParams(window.location.search).get(name) || undefined;
};

export type TikTokTrackingContext = {
  event_id: string;
  ttp?: string;
  ttclid?: string;
  url?: string;
  user_agent?: string;
};

export const buildTikTokContext = (): TikTokTrackingContext => ({
  event_id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  ttp: hasMarketingConsent() ? readCookie('_ttp') : undefined,
  ttclid: hasMarketingConsent() ? readQueryParam('ttclid') || readCookie('ttclid') : undefined,
  url: typeof window !== 'undefined' && hasMarketingConsent() ? cleanPageLocation() : undefined,
  user_agent: hasMarketingConsent() && typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
});

export const trackTikTokEvent = (
  eventName: string,
  params: Record<string, unknown>,
  ctx: TikTokTrackingContext,
) => {
  if (typeof window === 'undefined' || !hasMarketingConsent() || !isSafeProviderPage() || !window.ttq) return;
  window.ttq.track(eventName, params, { event_id: ctx.event_id });
};
