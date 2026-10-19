import { consentClient } from './consent.ts';

// A disclosure acknowledgement, never a source of consent. A matching, current
// server-confirmed analytics permission is required as well. Older grants and
// choices made in the app (which has no PostHog disclosure) cannot enable this SDK.
export const POSTHOG_DISCLOSURE_KEY = 'notably.posthog-disclosure:v1';
export const POSTHOG_DISCLOSURE_VERSION = 'landing-posthog-2026-10-19';
export const POSTHOG_DISCLOSURE_EVENT = 'notably:posthog-disclosure';

export function hasPostHogConsent(): boolean {
  try {
    const view = consentClient.view();
    const c = view.response?.consent;
    if (!view.permissions.analytics || !c) return false;
    const receipt = JSON.parse(window.localStorage.getItem(POSTHOG_DISCLOSURE_KEY) ?? 'null');
    return receipt?.version === POSTHOG_DISCLOSURE_VERSION && receipt.revision === c.revision &&
      receipt.decidedAt === c.decidedAt && receipt.expiresAt === c.expiresAt;
  } catch { return false; }
}

/** Called only after an explicit choice in the updated landing consent UI succeeds. */
export function acknowledgePostHogDisclosure(): void {
  try {
    const view = consentClient.view();
    const c = view.response?.consent;
    if (!view.permissions.analytics || view.choosing || !c) return;
    window.localStorage.setItem(POSTHOG_DISCLOSURE_KEY, JSON.stringify({
      version: POSTHOG_DISCLOSURE_VERSION, revision: c.revision,
      decidedAt: c.decidedAt, expiresAt: c.expiresAt,
    }));
    window.dispatchEvent(new Event(POSTHOG_DISCLOSURE_EVENT));
  } catch { /* Unavailable storage leaves PostHog off, without affecting other tools. */ }
}

export function forgetPostHogDisclosure(): void {
  try {
    window.localStorage.removeItem(POSTHOG_DISCLOSURE_KEY);
    window.dispatchEvent(new Event(POSTHOG_DISCLOSURE_EVENT));
  } catch { /* Server permission is still checked before every capture. */ }
}
