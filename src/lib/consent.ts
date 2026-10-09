import { createConsentClient, type PurposeConsent } from './consent-client.ts';
import { isProductionPage } from './marketing-policy.ts';
export type ConsentValue = PurposeConsent;

// Only server-confirmed state in memory can authorize optional tools. Browser storage
// is used solely to retain an unsynchronized rejection/withdrawal across reloads.
export const consentClient = createConsentClient({
  fetch: (...args) => fetch(...args),
  storage: () => { try { return window.localStorage; } catch { return null; } },
  document: () => typeof document === 'undefined' ? null : document,
  enabled: () => typeof window !== 'undefined' && isProductionPage(),
});
export const readConsent = () => consentClient.view();
export const hasMarketingConsent = () => consentClient.view().granted;
export const hasAnalyticsConsent = () => consentClient.view().permissions.analytics;
export const saveConsent = (value: ConsentValue) => consentClient.choose(value);
export const onConsentChange = (listener: () => void) => consentClient.subscribe(listener);
const OPEN_EVENT = 'notably:open-privacy-choices';
export const openPrivacyChoices = () => window.dispatchEvent(new Event(OPEN_EVENT));
export const onOpenPrivacyChoices = (listener: () => void) => {
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
};
