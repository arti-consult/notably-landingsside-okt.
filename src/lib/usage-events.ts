import { consentClient } from './consent.ts';
import { CONSENT_API, isProductionPage } from './marketing-policy.ts';

export type UsagePage = 'home' | 'advokat' | 'regnskapsforer' | 'bygg-og-anlegg';
type UsageEvent = 'pricing.viewed' | 'sales.clicked';
const PAGE_PATHS: Record<UsagePage, string> = {
  home: '/', advokat: '/advokat', regnskapsforer: '/regnskapsforer', 'bygg-og-anlegg': '/bygg-og-anlegg',
};

/** Return whether a request was started, never a claim that storage succeeded. */
export function recordUsageEvent(eventName: UsageEvent, page: UsagePage): boolean {
  try {
    if (typeof window === 'undefined' || !isProductionPage()) return false;
    if ((window.location.pathname.replace(/\/$/, '') || '/') !== PAGE_PATHS[page]) return false;
    const current = consentClient.view();
    if (!current.permissions.analytics || !current.response || current.choosing) return false;
    const body = {
      requestId: crypto.randomUUID(),
      expectedRevision: current.response.consent.revision,
      eventName,
      page,
    };
    // No queue, persistent identifier or provider SDK. A storage/network failure
    // cannot change navigation, the contact modal or the visitor's consent state.
    void fetch(`${CONSENT_API}/v1/consent/usage-events`, {
      method: 'POST', credentials: 'include', keepalive: true, cache: 'no-store',
      redirect: 'error', referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json', 'X-Notably-Consent-CSRF': current.response.csrfToken },
      body: JSON.stringify(body),
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

/** Observe a real viewport impression, including consent granted while visible. */
export function observePricingView(element: HTMLElement, page: UsagePage, state: { recorded: boolean }) {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  let visible = false;
  let disposed = false;
  const capture = () => {
    if (!disposed && visible && !state.recorded && document.visibilityState === 'visible') {
      state.recorded = recordUsageEvent('pricing.viewed', page);
    }
  };
  const observer = new IntersectionObserver((entries) => {
    const entry = entries.find(candidate => candidate.target === element);
    if (!entry) return;
    visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
    capture();
  }, { threshold: 0.1 });
  observer.observe(element);
  const unsubscribe = consentClient.subscribe(capture);
  document.addEventListener('visibilitychange', capture);
  return () => {
    disposed = true;
    observer.disconnect();
    unsubscribe();
    document.removeEventListener('visibilitychange', capture);
  };
}
