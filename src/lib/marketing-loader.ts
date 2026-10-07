import { initMarketingTracking } from './analytics.ts';
import { hasMarketingConsent, onConsentChange } from './consent.ts';

/** Own the deferred load and cancel it when consent changes or React unmounts. */
export const startMarketingScriptsLoader = (): (() => void) => {
  let timeoutId: number | null = null;

  const cancelPending = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const onLoad = () => {
    cancelPending();
    if (!hasMarketingConsent()) return;

    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      // The initializer checks current consent again at execution time.
      initMarketingTracking();
    }, 1200);
  };

  if (document.readyState === 'complete') {
    onLoad();
  } else {
    window.addEventListener('load', onLoad, { once: true });
  }

  const unsubscribe = onConsentChange((state) => {
    cancelPending();
    if (state.marketing === 'granted') initMarketingTracking();
  });

  return () => {
    window.removeEventListener('load', onLoad);
    cancelPending();
    unsubscribe();
  };
};
