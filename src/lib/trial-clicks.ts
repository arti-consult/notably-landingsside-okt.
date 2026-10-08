import { decorateSignup, signupDestination } from './marketing-attribution.ts';
import type { Attribution } from './consent-client.ts';
import { isProductionPage, publicPagePath, SALES_REF } from './marketing-policy.ts';
import { hasMarketingConsent } from './consent.ts';
import { trackStartTrialClick } from './analytics.ts';

/** One delegated listener covers React, lazy sections, article CTAs and keyboard activation. */
export function startTrialLinks(getAttribution: () => Attribution | null): () => void {
  let salesRef: string | null = null;
  const originals = new Map<HTMLAnchorElement, string>();
  const refreshLinks = () => {
    const url = new URL(window.location.href);
    if (!isProductionPage(url)) return;
    const ref = url.searchParams.getAll('ref');
    if (ref.length === 1 && SALES_REF.test(ref[0])) salesRef = ref[0];
    for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href]')) {
      if (!signupDestination(a.href)) continue;
      const original = originals.get(a) ?? a.href;
      originals.set(a, original);
      const next = decorateSignup(original, hasMarketingConsent() ? getAttribution() : null, salesRef);
      if (a.href !== next) a.href = next;
    }
    for (const a of originals.keys()) if (!a.isConnected) originals.delete(a);
  };
  const onClick = (event: MouseEvent) => {
    if (!event.isTrusted || event.defaultPrevented || (event.type === 'click' ? event.button !== 0 : event.button !== 1)) return;
    const a = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!a || !signupDestination(a.href) || !isProductionPage()) return;
    refreshLinks();
    if (!hasMarketingConsent()) return;
    const section = a.closest('section[id]')?.id;
    const raw = a.dataset.trialCta ?? (a.closest('nav,header') ? 'navigation' : a.closest('footer') ? 'footer' : section ?? 'content');
    const placement = /^[a-z0-9_-]{1,64}$/.test(raw) ? raw : 'content';
    trackStartTrialClick({ button_id: placement, page_path: publicPagePath(new URL(window.location.href))! });
    window.dispatchEvent(new Event('notably:capture-attribution'));
  };
  const observer = new MutationObserver(refreshLinks);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
  document.addEventListener('click', onClick);
  document.addEventListener('auxclick', onClick);
  window.addEventListener('notably:refresh-trial-links', refreshLinks);
  refreshLinks();
  return () => {
    observer.disconnect();
    document.removeEventListener('click', onClick);
    document.removeEventListener('auxclick', onClick);
    window.removeEventListener('notably:refresh-trial-links', refreshLinks);
    for (const [a, original] of originals) if (a.isConnected) a.href = original;
  };
}
