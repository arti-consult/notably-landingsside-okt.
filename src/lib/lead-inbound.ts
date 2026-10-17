import { leadAttribution } from './marketing-attribution.ts';
import { LEAD_INBOUND_URL } from './marketing-policy.ts';
import { hasMarketingConsent } from './consent.ts';

/**
 * Venteliste → Notably OS (leadinntak): ett kort hos riktig selger. utm/klikk-id-er bare med markedsføringssamtykke,
 * henvisningskoden (ref) alltid når formatet er gyldig. Feil svelges – ventelisten fungerer som før uansett.
 */
export async function sendWaitlistLead(email: string, fetchImpl: typeof fetch = fetch, href = window.location.href, consented = hasMarketingConsent()): Promise<boolean> {
  try {
    const url = new URL(href);
    const key = globalThis.crypto?.randomUUID?.();
    if (!key) return false;
    const res = await fetchImpl(LEAD_INBOUND_URL, {
      method: 'POST', mode: 'cors', credentials: 'omit', keepalive: true, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, source: 'venteliste', email, attribution: { ...leadAttribution(url, consented), landing_page: `${url.origin}${url.pathname}` } }),
    });
    return res.ok;
  } catch { return false; }
}
