const GA_MEASUREMENT_ID = 'G-NJRML2BKQP';
const FB_PIXEL_ID = '1783628368949768';

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

export const initMarketingTracking = () => {
  if (marketingInitialized || typeof window === 'undefined') {
    return;
  }

  marketingInitialized = true;
  initGoogleAnalytics();
  initMetaPixel();
};
