/** Optional public-page measurement. No form values, text, URLs or error messages leave this module. */
export type EngagementEvent = 'section_viewed' | 'section_engaged' | 'faq_opened' | 'calculator_used' | 'contact_click' | 'landing_error';
export type EngagementProperties = Record<string, string | number>;
export const PRIVATE_SELECTOR = 'iframe, form, input, textarea, select, [contenteditable], [data-demo-modal], [data-posthog-private], .ph-no-capture, .ph-no-autocapture, [data-ph-no-autocapture]';
const aliases: Record<string, string> = { pris: 'pricing', pricing: 'pricing', kalkulator: 'calculator', faq: 'faq', sikkerhet: 'security', motetyper: 'meeting_types', innvendinger: 'objections', endringer: 'changes' };
const sectionIds = new Set(['hero', 'customer_logos', 'problem', 'features', 'mobile_app', 'security', 'customer_story', 'ai_answers', 'integrations', 'use_cases', 'pricing', 'faq', 'calculator', 'meeting_types', 'channels', 'sharing', 'objections', 'changes']);
export function safeSection(value: unknown): value is string { return typeof value === 'string' && sectionIds.has(value); }

export function startLandingEngagement(capture: (event: EngagementEvent, properties: EngagementProperties) => void, allowed: () => boolean) {
  const page = window.location.pathname;
  const seen = new Set<string>();
  const sections = new Map<Element, { id: string; since: number | null }>();
  let stopped = false;
  const active = () => !stopped && allowed() && window.location.pathname === page;
  const emit = (event: EngagementEvent, properties: EngagementProperties, key?: string) => {
    if (!active() || (key && seen.has(key))) return;
    if (key) seen.add(key);
    try { capture(event, properties); } catch { /* Optional analytics must not affect the page. */ }
  };
  const hidden = () => document.visibilityState === 'hidden' || !!document.querySelector('[aria-modal="true"]');
  const scan = () => {
    for (const [element] of sections) if (!element.isConnected) sections.delete(element);
    document.querySelectorAll('[data-ph-section], section[id]').forEach(element => {
      const id = element.getAttribute('data-ph-section') || aliases[element.id];
      if (safeSection(id) && !sections.has(element)) sections.set(element, { id, since: null });
    });
    // Observe only the outer modal's existing timeout indicator; never inspect the iframe.
    if (document.querySelector('[data-demo-fallback]')) emit('landing_error', { error_category: 'demo_load_timeout' }, 'error:demo_load_timeout');
  };
  const sample = () => {
    if (!active()) return;
    const now = performance.now();
    const obscured = hidden();
    for (const [element, state] of sections) {
      const rect = element.getBoundingClientRect();
      const visible = !obscured && element.isConnected && rect.width > 0 && rect.height > 0 &&
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0) >= Math.min(rect.height, window.innerHeight) / 2;
      if (!visible) { state.since = null; continue; }
      state.since ??= now;
      const duration = now - state.since;
      if (duration >= 1000) emit('section_viewed', { section_id: state.id }, `view:${state.id}`);
      if (duration >= 5000) emit('section_engaged', { section_id: state.id, visible_seconds: 5 }, `engaged:${state.id}`);
    }
  };
  const clicked = (event: MouseEvent) => {
    if (!event.isTrusted || !active() || !(event.target instanceof Element) || event.target.closest(PRIVATE_SELECTOR)) return;
    const target = event.target.closest('button, a');
    if (!target) return;
    const faq = target.getAttribute('data-ph-faq');
    if (faq && /^question-[1-9][0-9]?$/.test(faq) && target.getAttribute('aria-expanded') === 'false') {
      emit('faq_opened', { question_id: faq }, `faq:${faq}`);
    }
    const kind = target.getAttribute('data-ph-contact') || (target.matches('a[href^="mailto:"]') ? 'email' : target.matches('a[href^="tel:"]') ? 'phone' : null);
    if (kind && ['enterprise_open', 'email', 'phone'].includes(kind)) emit('contact_click', { contact_type: kind });
  };
  const changed = (event: Event) => {
    if (!event.isTrusted || !active() || !(event.target instanceof Element)) return;
    // A deliberate slider change is enough. Never read its value or calculated business figures.
    if (event.target.matches('[data-ph-section="calculator"] input[type="range"], #kalkulator input[type="range"]')) emit('calculator_used', { section_id: 'calculator' }, 'calculator');
  };
  const error = (event: Event) => {
    if (!active()) return;
    if (event instanceof ErrorEvent) {
      try {
        const url = new URL(event.filename);
        if (url.origin === window.location.origin && url.pathname.startsWith('/assets/')) emit('landing_error', { error_category: 'runtime_error' }, 'error:runtime_error');
      } catch { /* Unknown and third-party errors are excluded. */ }
    } else if (event.target instanceof Element && event.target.matches('script[src], link[rel="stylesheet"], img[src]') && !event.target.closest(PRIVATE_SELECTOR)) {
      const value = event.target.getAttribute('src') || event.target.getAttribute('href');
      try {
        if (value && new URL(value, window.location.href).origin === window.location.origin) emit('landing_error', { error_category: 'asset_load_failed' }, 'error:asset_load_failed');
      } catch { /* Invalid resource address. */ }
    }
  };
  const visibility = () => { for (const state of sections.values()) state.since = null; };
  const observer = new MutationObserver(scan);
  observer.observe(document.body, { childList: true, subtree: true });
  scan(); sample();
  const interval = window.setInterval(sample, 250);
  document.addEventListener('click', clicked, true);
  document.addEventListener('change', changed, true);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('error', error, true);
  return () => {
    stopped = true; observer.disconnect(); window.clearInterval(interval); sections.clear();
    document.removeEventListener('click', clicked, true);
    document.removeEventListener('change', changed, true);
    document.removeEventListener('visibilitychange', visibility);
    window.removeEventListener('error', error, true);
  };
}
