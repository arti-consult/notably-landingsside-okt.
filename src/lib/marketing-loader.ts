import { initMarketingTracking, isMarketingTrackingActive, activeTrackingPurposes, revokeMarketingTracking, suspendTrackingForReload } from './analytics.ts';
import { consentClient, hasMarketingConsent, hasAnalyticsConsent } from './consent.ts';
import { NO_PURPOSES, type Attribution } from './consent-client.ts';
import { readAttribution, canCaptureSource } from './marketing-attribution.ts';
import { isProductionPage } from './marketing-policy.ts';
import { startTrialLinks } from './trial-clicks.ts';

/** No identifiers are persisted locally. The API's shared cookie ties them to checkout. */
export function startMarketingScriptsLoader(): () => void {
  let stopped = false;
  let remembered: Attribution | null = null;
  let preparing: Promise<void> | null = null;
  let signature = '';
  let captured = '';
  let reloadScheduled = false;
  let needsReload = false;
  const updateLinks = () => window.dispatchEvent(new Event('notably:refresh-trial-links'));
  const stopLinks = startTrialLinks(() => remembered);

  function stopTracking() {
    remembered = null;
    captured = '';
    updateLinks();
    const active = isMarketingTrackingActive();
    if (active) suspendTrackingForReload();
    revokeMarketingTracking(isProductionPage() ? consentClient.view().permissions : NO_PURPOSES);
    needsReload ||= active;
    if (needsReload && !reloadScheduled) {
      // A persisted denial is replayed on reload before any provider is loaded.
      const v = consentClient.view();
      if (!v.choosing && (!v.pendingDenial || consentClient.hasDurableDenial())) {
        reloadScheduled = true;
        window.location.reload();
      }
    }
  }
  async function prepare() {
    if (stopped || needsReload || (!hasMarketingConsent() && !hasAnalyticsConsent()) || !isProductionPage()) return;
    const initial = window.location.href;
    const input = hasMarketingConsent() ? readAttribution(new URL(initial), document.cookie) : null;
    if (input) {
      remembered = { ...input, identifiers: { ...remembered?.identifiers, ...input.identifiers }, utm: { ...remembered?.utm, ...input.utm } };
      updateLinks();
      // Other public pages retain consented URL identifiers on signup links. Their
      // source URLs must be explicitly approved by the API before direct capture.
      const captureKey = JSON.stringify([consentClient.view().response?.consent.revision, input]);
      if (canCaptureSource(input) && captured !== captureKey) {
        if (!(await consentClient.capture(input))) return;
        captured = captureKey;
      }
      if (stopped || !hasMarketingConsent() || window.location.href !== initial) return;
      // Valid campaign parameters remain on this public URL so the consented
      // provider SDKs can attribute CTA clicks. No browser storage is used here.
    }
    if (stopped || needsReload || (!hasMarketingConsent() && !hasAnalyticsConsent())) return;
    updateLinks();
    initMarketingTracking();
  }
  function schedulePrepare() {
    if (preparing || stopped) return;
    preparing = prepare().catch(() => {
      changed();
    }).finally(() => { preparing = null; });
  }
  function changed() {
    if (stopped) return;
    const v = consentClient.view();
    const next = `${v.permissions.analytics}:${v.permissions.advertising}:${v.phase}:${v.pendingDenial}:${v.choosing}:${v.response?.consent.revision}`;
    if (signature === next) return;
    signature = next;
    if (!v.permissions.advertising) { remembered = null; captured = ''; updateLinks(); }
    const active = activeTrackingPurposes();
    if (needsReload || (active.analytics && !v.permissions.analytics) ||
      (active.advertising && !v.permissions.advertising) || (!v.permissions.analytics && !v.permissions.advertising)) stopTracking();
    else schedulePrepare();
  }
  const stopConsent = consentClient.subscribe(changed);
  const refresh = () => {
    if (!isProductionPage()) { stopTracking(); return; }
    void consentClient.refresh().then(() => { changed(); schedulePrepare(); }).catch(() => changed());
  };
  const visible = () => { if (document.visibilityState === 'visible') refresh(); };
  const storage = (event: StorageEvent) => { if (event.key?.includes('consent')) { consentClient.externalChange(); changed(); refresh(); } };
  window.addEventListener('focus', refresh);
  window.addEventListener('online', refresh);
  window.addEventListener('storage', storage);
  document.addEventListener('visibilitychange', visible);
  window.addEventListener('notably:capture-attribution', schedulePrepare);
  const interval = window.setInterval(() => { if (document.visibilityState === 'visible') refresh(); }, 60_000);
  refresh();
  return () => {
    stopped = true; stopConsent(); stopLinks();
    window.clearInterval(interval);
    window.removeEventListener('focus', refresh);
    window.removeEventListener('online', refresh);
    window.removeEventListener('storage', storage);
    document.removeEventListener('visibilitychange', visible);
    window.removeEventListener('notably:capture-attribution', schedulePrepare);
  };
}
