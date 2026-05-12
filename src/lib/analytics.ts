const GA_MEASUREMENT_ID = 'G-NJRML2BKQP';
const FB_PIXEL_ID = '1783628368949768';
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

const initGoogleAnalytics = () => {
  appendScript('notably-ga-script', `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
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
  if (marketingInitialized || typeof window === 'undefined') {
    return;
  }

  marketingInitialized = true;
  initGoogleAnalytics();
  initMetaPixel();
  initTikTokPixel();
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
  ttp: readCookie('_ttp'),
  ttclid: readQueryParam('ttclid') || readCookie('ttclid'),
  url: typeof window !== 'undefined' ? window.location.href : undefined,
  user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
});

export const trackTikTokEvent = (
  eventName: string,
  params: Record<string, unknown>,
  ctx: TikTokTrackingContext,
) => {
  if (typeof window === 'undefined' || !window.ttq) return;
  window.ttq.track(eventName, params, { event_id: ctx.event_id });
};
