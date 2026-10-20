import type { PostHog, PostHogConfig, CaptureResult } from 'posthog-js';
import { consentClient, hasMarketingConsent } from './consent.ts';
import { hasPostHogConsent, POSTHOG_DISCLOSURE_EVENT, POSTHOG_DISCLOSURE_KEY } from './posthog-consent.ts';
import { isSafeProviderPage, publicPagePath } from './marketing-policy.ts';
import { PRIVATE_SELECTOR, safeSection, startLandingEngagement } from './posthog-engagement.ts';

// Public, write-only project token. No account API key is shipped to the browser.
export const POSTHOG_PROJECT_TOKEN = 'phc_CiiZAE4mV6T54hecR2gLFRpf8XtNhbN4SWYGoZ5LFtvJ';
export const POSTHOG_API_HOST = 'https://eu.i.posthog.com';
export const POSTHOG_STORAGE_NAME = 'notably_landing';
export type LandingEvent = 'start_trial_click' | 'demo_click' | 'demo_booked';
type Properties = Record<string, unknown>;
type Client = Pick<PostHog, 'init' | 'capture' | 'set_config' | 'opt_in_capturing' | 'opt_out_capturing' | 'stopSessionRecording'>;
type Load = () => Promise<Client>;
const eventNames = new Set(['$pageview', '$pageleave', '$$heatmap', '$snapshot', '$autocapture', '$rageclick', '$dead_click', '$web_vitals', 'start_trial_click', 'demo_click', 'demo_booked', 'section_viewed', 'section_engaged', 'faq_opened', 'calculator_used', 'contact_click', 'landing_error']);
const safeProperties = new Set([
  'token', 'distinct_id', '$device_id', '$session_id', '$window_id', '$pageview_id', '$insert_id',
  '$lib', '$lib_version', '$browser', '$browser_version', '$os', '$os_version', '$device_type',
  '$screen_height', '$screen_width', '$viewport_height', '$viewport_width',
  '$snapshot_data', '$snapshot_bytes', '$snapshot_source',
  '$prev_pageview_id', '$prev_pageview_duration', '$prev_pageview_max_scroll_percentage',
  '$prev_pageview_max_scroll', '$prev_pageview_last_scroll', '$prev_pageview_last_scroll_percentage',
  '$prev_pageview_max_content_height', '$prev_pageview_last_content_height',
  '$prev_pageview_max_content_percentage', '$prev_pageview_last_content_percentage',
  '$prev_pageview_max_scroll_y', '$prev_pageview_last_scroll_y',
]);
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content'] as const;
const campaignValue = /^[a-zA-Z0-9_ .|()/-]{1,120}$/;

function cleanUrl(value: string): string {
  try {
    const url = new URL(value, window.location.origin);
    return url.origin === window.location.origin && publicPagePath(url) ? `${url.origin}${publicPagePath(url)}` : url.origin;
  } catch { return ''; }
}

function referrerHost(): string {
  try { return document.referrer ? new URL(document.referrer).hostname : ''; } catch { return ''; }
}

/** Own lifetime, independent of the Google/Meta loader and its request queue. */
export function createLandingAnalytics(load: Load = async () => (await import('posthog-js')).default) {
  const arrival = new URL(window.location.href);
  const referrer = referrerHost();
  let sdk: Client | null = null;
  let loading: Promise<void> | null = null;
  let active = false;
  let stopped = false;
  let generation = 0;
  let lastPage = '';
  let failed = false;
  let stopEngagement: (() => void) | null = null;
  let performancePage = '';
  const allowed = () => !stopped && hasPostHogConsent() && isSafeProviderPage();

  function context(): Properties {
    const props: Properties = {
      site: 'notably.no', measurement_version: 2,
      $current_url: cleanUrl(window.location.href), $pathname: window.location.pathname,
      $host: window.location.hostname, $referrer: referrer ? `https://${referrer}` : '',
      $referring_domain: referrer || '$direct',
      traffic_source: referrer || 'direct',
    };
    // Match the existing purpose split. No ad click IDs, search terms or sales refs.
    if (hasMarketingConsent()) {
      for (const key of campaignKeys) {
        const value = arrival.searchParams.get(key);
        if (arrival.searchParams.getAll(key).length === 1 && value && campaignValue.test(value)) props[key] = value;
      }
      if (props.utm_source) props.traffic_source = props.utm_source;
    }
    return props;
  }

  function beforeSend(event: CaptureResult | null): CaptureResult | null {
    if (!event || !active || !allowed() || !eventNames.has(event.event)) return null;
    const props: Properties = {};
    for (const [key, value] of Object.entries(event.properties)) if (safeProperties.has(key)) props[key] = value;
    // Scrollmaps use the previous page path, including on the next SPA pageview.
    // Keep only an allowlisted public pathname, never query strings or fragments.
    const previousPath = event.properties.$prev_pageview_pathname;
    if (typeof previousPath === 'string' && previousPath.startsWith('/') && !previousPath.startsWith('//')) {
      try {
        const url = new URL(previousPath, window.location.origin);
        if (url.origin === window.location.origin) {
          const path = publicPagePath(url);
          if (path) props.$prev_pageview_pathname = path;
        }
      } catch { /* Invalid previous path is excluded. */ }
    }
    for (const key of ['button_id', 'page_path']) {
      const value = event.properties[key];
      if (typeof value === 'string' && (key === 'button_id' ? /^[a-z0-9_-]{1,64}$/.test(value) : publicPagePath(new URL(value, window.location.origin)))) props[key] = value;
    }
    if (safeSection(event.properties.section_id)) props.section_id = event.properties.section_id;
    if (/^question-[1-9][0-9]?$/.test(String(event.properties.question_id ?? ''))) props.question_id = event.properties.question_id;
    if (event.properties.visible_seconds === 5) props.visible_seconds = 5;
    if (['enterprise_open', 'email', 'phone'].includes(String(event.properties.contact_type))) props.contact_type = event.properties.contact_type;
    if (['runtime_error', 'asset_load_failed', 'demo_load_timeout'].includes(String(event.properties.error_category))) props.error_category = event.properties.error_category;
    // Native clickmaps need element positions, never text, hrefs, values or arbitrary attributes.
    if (['$autocapture', '$rageclick', '$dead_click'].includes(event.event)) {
      if (event.properties.$event_type !== 'click') return null;
      props.$event_type = 'click';
      if (typeof event.properties.$ce_version === 'number') props.$ce_version = event.properties.$ce_version;
      const elements = event.properties.$elements;
      const chain = event.properties.$elements_chain;
      // Current SDKs serialize the chain before before_send. Accept only tags and sibling positions.
      if (typeof chain === 'string' && chain.length <= 6000 && chain.split(';').every(part => /^[a-z][a-z0-9-]{0,30}(?::nth-child="[1-9][0-9]{0,5}"nth-of-type="[1-9][0-9]{0,5}")?$/.test(part))) {
        props.$elements_chain = chain;
      } else if (Array.isArray(elements)) props.$elements = elements.slice(0,30).map(element => {
        const clean: Properties = {};
        if (!element || typeof element !== 'object') return clean;
        if (typeof element.tag_name === 'string' && /^[a-z][a-z0-9-]{0,30}$/.test(element.tag_name)) clean.tag_name = element.tag_name;
        for (const key of ['nth_child', 'nth_of_type']) if (Number.isInteger(element[key]) && element[key] > 0) clean[key] = element[key];
        return clean;
      });
      else return null;
    }
    if (event.event === '$web_vitals') {
      // Only initial-navigation vitals. Never attribute a late initial-page measurement to a new SPA route.
      if (cleanUrl(window.location.href) !== performancePage) return null;
      for (const metric of ['LCP', 'FCP', 'INP', 'CLS']) {
        const key = `$web_vitals_${metric}_value`, value = event.properties[key];
        if (typeof value === 'number' && Number.isFinite(value) && value >= 0) props[key] = value;
      }
      // The nested SDK attribution objects may contain DOM nodes, URLs and text; omit them entirely.
    }
    // Heatmaps key their coordinate arrays by URL. Drop query strings and fragments.
    const heatmaps = event.properties.$heatmap_data;
    if (heatmaps && typeof heatmaps === 'object') {
      props.$heatmap_data = Object.fromEntries(Object.entries(heatmaps).map(([url, points]) => [cleanUrl(url), points]));
    }
    const pageContext = context();
    if (event.event === '$pageleave' && lastPage) {
      pageContext.$current_url = lastPage;
      pageContext.$pathname = new URL(lastPage).pathname;
    }
    return { ...event, properties: { ...props, ...pageContext, $process_person_profile: false, $is_identified: false, $geoip_disable: true } };
  }

  function config(): Partial<PostHogConfig> {
    return {
      api_host: POSTHOG_API_HOST, ui_host: 'https://eu.posthog.com',
      persistence: 'sessionStorage', persistence_name: POSTHOG_STORAGE_NAME,
      cross_subdomain_cookie: false, secure_cookie: true,
      opt_out_capturing_by_default: true, opt_out_persistence_by_default: true,
      person_profiles: 'never',
      autocapture: {
        dom_event_allowlist: ['click'], element_allowlist: ['a', 'button'],
        css_selector_allowlist: ['[data-ph-section]', 'section[id]', 'nav', 'footer', '[data-ph-contact]'],
        css_selector_ignorelist: [PRIVATE_SELECTOR, '[aria-modal="true"]'], capture_copied_text: false,
      },
      mask_all_text: true, mask_all_element_attributes: true,
      rageclick: { css_selector_ignorelist: [PRIVATE_SELECTOR, '[aria-modal="true"]', '[data-ph-section="calculator"]'], content_ignorelist: true, ignore_text_selection: true },
      capture_pageview: false, capture_pageleave: true,
      save_campaign_params: false, save_referrer: false,
      disable_capture_url_hashes: true,
      capture_exceptions: false,
      capture_dead_clicks: { css_selector_ignorelist: [PRIVATE_SELECTOR, '[aria-modal="true"]', 'a[target="_blank"]', 'a[href^="mailto:"]', 'a[href^="tel:"]'], capture_dead_swipes: false },
      capture_performance: { network_timing: false, web_vitals: true, web_vitals_attribution: false, web_vitals_allowed_metrics: ['LCP', 'FCP', 'INP', 'CLS'] },
      enable_recording_console_log: false, disable_surveys: true,
      advanced_disable_feature_flags: true, remote_config_refresh_interval_ms: 0,
      request_batching: false,
      capture_heatmaps: true,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true, maskTextSelector: '*',
        // Preserve public layout, but mask content/URL attributes (including CTA
        // links that the existing advertising code decorates with click IDs).
        maskAttributeFn: (name, value) => {
          if (['class', 'id', 'style'].includes(name) && !/url\s*\(|@|https?:|gclid|fbclid/i.test(value)) return value;
          return '*'.repeat(value.length);
        },
        blockSelector: 'iframe, form, input, textarea, select, [contenteditable], [data-demo-modal], [data-posthog-private], canvas, video, audio',
        recordCrossOriginIframes: false, recordHeaders: false, recordBody: false,
        captureCanvas: { recordCanvas: false },
        // Applies to initial navigation metadata too; never capture request payloads.
        maskCapturedNetworkRequestFn: data => data.isInitial ? { ...data, name: cleanUrl(data.name) } : null,
        maskNetworkRequestFn: data => ({ ...data, url: cleanUrl(data.url) }),
      },
      before_send: beforeSend,
    };
  }

  function deactivate() {
    generation++;
    lastPage = '';
    stopEngagement?.(); stopEngagement = null;
    if (!active) return;
    active = false; // Guard captures before asking the SDK to stop or clear buffers.
    try { sdk?.opt_out_capturing(); } catch { /* Optional SDK. */ }
    try { sdk?.stopSessionRecording(); } catch { /* Optional SDK. */ }
    try { sdk?.set_config({ capture_heatmaps: false, disable_session_recording: true, disable_persistence: true }); } catch { /* Optional SDK. */ }
  }

  function pageview() {
    const page = cleanUrl(window.location.href);
    if (!active || !allowed() || page === lastPage) return;
    stopEngagement?.(); stopEngagement = null;
    if (lastPage) {
      try { sdk?.capture('$pageleave'); } catch { /* Optional page-duration measurement. */ }
    }
    lastPage = page;
    try { sdk?.capture('$pageview', context()); } catch { /* Never break rendering. */ }
    try { stopEngagement = startLandingEngagement((event, properties) => {
      if (active && allowed()) sdk?.capture(event, properties);
    }, () => active && allowed()); } catch { /* Older browsers may lack observer support. */ }
  }

  function sync(): Promise<void> {
    if (!allowed()) { deactivate(); return Promise.resolve(); }
    if (failed) return Promise.resolve();
    if (active) { pageview(); return Promise.resolve(); }
    if (loading) return loading;
    const started = generation;
    loading = load().then(client => {
      if (started !== generation || !allowed()) return;
      const first = !sdk;
      sdk = client;
      active = true;
      performancePage = cleanUrl(window.location.href);
      if (first) sdk.init(POSTHOG_PROJECT_TOKEN, config());
      else sdk.set_config({ ...config(), disable_persistence: false });
      sdk.opt_in_capturing({ captureEventName: false });
      pageview();
    }).catch(() => { deactivate(); failed = true; }).finally(() => { loading = null; });
    return loading;
  }

  function capture(event: LandingEvent, params: { button_id: string; page_path: string }) {
    // No backlog from before consent, after revocation, or on unsafe/preview URLs.
    if (!allowed()) return;
    const started = generation;
    const page = cleanUrl(window.location.href);
    void sync().then(() => {
      if (!active || !allowed() || started !== generation || page !== cleanUrl(window.location.href)) return;
      try { sdk?.capture(event, { ...context(), ...params }); } catch { /* Existing conversion calls are independent. */ }
    });
  }

  const stopConsent = consentClient.subscribe(() => { void sync(); });
  const changed = () => { void sync(); };
  const storage = (e: StorageEvent) => { if (e.key === POSTHOG_DISCLOSURE_KEY) changed(); };
  window.addEventListener(POSTHOG_DISCLOSURE_EVENT, changed);
  window.addEventListener('storage', storage);
  // Effective consent checks expiry locally; do not wait for the next API refresh.
  const interval = window.setInterval(changed, 1000);
  return { sync, capture, stop() {
    stopped = true; deactivate(); stopConsent(); window.clearInterval(interval);
    window.removeEventListener(POSTHOG_DISCLOSURE_EVENT, changed);
    window.removeEventListener('storage', storage);
  } };
}

const controllers = new WeakMap<Window, ReturnType<typeof createLandingAnalytics>>();
export function landingAnalytics() {
  let controller = controllers.get(window);
  if (!controller) { controller = createLandingAnalytics(); controllers.set(window, controller); }
  return controller;
}

export function captureLandingEvent(event: LandingEvent, params: { button_id: string; page_path: string }) {
  try { if (hasPostHogConsent() && isSafeProviderPage()) landingAnalytics().capture(event, params); } catch { /* No PostHog failure may affect a conversion. */ }
}
