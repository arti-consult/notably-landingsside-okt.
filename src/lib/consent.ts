/**
 * Samtykkestyring for valgfrie analyse- og markedsføringsverktøy.
 *
 * Personvernerklæringen lover at «valgfrie analyse- og markedsføringsverktøy
 * forblir avslått til du tillater dem gjennom Personvernvalg». Derfor er
 * standardtilstanden «denied»: ingen sporingsskript lastes før et aktivt
 * samtykke er lagret her, og ved tilbaketrekking sender vi revoke-signaler,
 * sletter kjente markedsføringskapsler og laster siden på nytt slik at
 * verktøyene faktisk slutter å kjøre.
 *
 * Valget lagres i localStorage, ikke i en kapsel: det holder valget lokalt hos
 * brukeren og gjør at ingen identifikator sendes til serveren for å huske det.
 */

export type ConsentValue = 'granted' | 'denied';

export type ConsentState = {
  /** Valgfrie analyse- og markedsføringsverktøy (GA4, Meta Pixel, TikTok Pixel). */
  marketing: ConsentValue;
  /** ISO-tidspunkt for når valget sist ble lagret. */
  updatedAt: string;
  /** Versjon av samtykketeksten valget ble gitt mot. */
  version: number;
};

export const CONSENT_VERSION = 1;
const STORAGE_KEY = 'notably.consent.v1';
const CHANGE_EVENT = 'notably:consent-change';
const OPEN_EVENT = 'notably:open-privacy-choices';

export const readConsent = (): ConsentState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.marketing !== 'granted' && parsed.marketing !== 'denied') return null;
    if (parsed.version !== CONSENT_VERSION) return null;

    return {
      marketing: parsed.marketing,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      version: CONSENT_VERSION,
    };
  } catch {
    // Privat nettleservindu eller blokkert lagring: behandles som «ikke valgt».
    return null;
  }
};

export const hasMarketingConsent = (): boolean => readConsent()?.marketing === 'granted';

export const saveConsent = (marketing: ConsentValue): ConsentState => {
  const state: ConsentState = {
    marketing,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Kan ikke lagres (privat modus). Valget gjelder fortsatt for denne økten.
  }

  window.dispatchEvent(new CustomEvent<ConsentState>(CHANGE_EVENT, { detail: state }));
  return state;
};

export const onConsentChange = (listener: (state: ConsentState) => void): (() => void) => {
  const handler = (event: Event) => listener((event as CustomEvent<ConsentState>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
};

/** Åpner Personvernvalg-panelet fra hvor som helst i appen (footer, personvernsiden). */
export const openPrivacyChoices = () => {
  window.dispatchEvent(new Event(OPEN_EVENT));
};

export const onOpenPrivacyChoices = (listener: () => void): (() => void) => {
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
};
