import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { consentClient, onConsentChange, onOpenPrivacyChoices, readConsent, saveConsent, type ConsentValue } from '../lib/consent';

/** Shared server consent; SDK lifecycle and immediate revocation live in marketing-loader. */
export default function ConsentManager() {
  const [view, setView] = useState(readConsent);
  const [panelOpen, setPanelOpen] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const savedAt = view.response?.consent.decidedAt;
  const decided = view.phase === 'ready' && !view.pendingDenial &&
    (view.granted || ['rejected', 'withdrawn'].includes(view.response?.consent.state ?? ''));
  const message = saving ? 'Lagrer personvernvalget …' : view.pendingDenial
    ? 'Valgfrie verktøy er av her. Vi prøver å synkronisere avslaget med webappen. Du kan prøve igjen nedenfor.'
    : view.phase === 'disabled' ? 'Valgfrie verktøy er av i denne forhåndsvisningen.'
    : view.phase === 'error' ? 'Vi kunne ikke hente eller lagre personvernvalget. Valgfrie verktøy er av. Prøv igjen.' : null;

  useEffect(() => onConsentChange(() => setView(readConsent())), []);
  useEffect(() => onOpenPrivacyChoices(() => {
    setView(readConsent());
    setMarketingChecked(readConsent().granted);
    setPanelOpen(true);
  }), []);

  useEffect(() => {
    if (!panelOpen) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPanelOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [panelOpen]);

  const apply = useCallback(async (value: ConsentValue) => {
    setSaving(true);
    try {
      await saveConsent(value);
      setMarketingChecked(readConsent().granted);
      if (!readConsent().pendingDenial) setPanelOpen(false);
    } catch {
      // The shared client retains denials and leaves optional tracking off.
    } finally { setSaving(false); setView(readConsent()); }
  }, []);
  const retry = async () => {
    setSaving(true);
    try { await consentClient.refresh(); } catch { /* Status below explains the failure. */ }
    finally { setSaving(false); setView(readConsent()); }
  };
  const status = message && <div role="status" aria-live="polite" className="mt-3 text-sm text-amber-200">
    {message}
    {!saving && <button type="button" onClick={() => void retry()} className="ml-2 underline">Prøv igjen</button>}
  </div>;

  if ((decided || view.phase === 'loading') && !panelOpen && !view.pendingDenial) return null;

  return (
    <>
      {!decided && !panelOpen && (
        <div
          role="region"
          aria-label="Personvernvalg"
          className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-800 bg-black/95 p-5 text-white shadow-2xl backdrop-blur sm:p-6">
            <p className="text-sm leading-relaxed text-gray-300">
              Vi bruker nødvendige informasjonskapsler for at nettstedet skal fungere. Med ditt samtykke bruker vi
              Google, Meta og TikTok til analyse og måling. Google og Meta kan få beskjed når du klikker «Start gratis»
              og starter en prøveperiode, slik at vi kan måle annonsene våre. Valget gjelder nettsiden og webappen.
              Valgfrie verktøy er av til du godtar. Les mer i{' '}
              <Link to="/personvern" className="text-blue-400 underline underline-offset-2 hover:text-blue-300">
                personvernerklæringen
              </Link>
              .
            </p>

            {status}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Personvernvalg
              </button>
              <button
                type="button"
                onClick={() => void apply('denied')}
                className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-gray-500"
              >
                Bare nødvendige
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void apply('granted')}
                className="rounded-full bg-[#2663eb] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Godta alle
              </button>
            </div>
          </div>
        </div>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 sm:items-center sm:p-6">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="personvernvalg-tittel"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-800 bg-black p-6 text-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="personvernvalg-tittel" className="text-xl font-semibold">
                Personvernvalg
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Lukk personvernvalg"
                className="rounded-full p-1 text-gray-400 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Her styrer du valgfrie analyse- og markedsføringsverktøy på nettsiden og i webappen. Du kan endre valget når som helst.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-gray-800 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Nødvendige</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Kreves for sikkerhet, innloggingsøkter og for å huske personvernvalget ditt. Kan ikke slås av.
                    </p>
                  </div>
                  <span className="mt-1 shrink-0 text-sm text-gray-500">Alltid på</span>
                </div>
              </div>

              <label className="block cursor-pointer rounded-xl border border-gray-800 p-4 transition-colors hover:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Analyse og markedsføring</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Google Analytics og konverteringsmåling, Meta Pixel og TikTok Pixel. Verktøyene kan motta
                      nettidentifikatorer og begrensede opplysninger om offentlige sider, henviser, nettleser, enhet og samhandling.
                      Google og Meta kan knytte klikk på «Start gratis» og bekreftet prøvestart til annonsene våre.
                      Møteinnhold, navn, e-post og betalingsbeløp inngår ikke i denne prøvestartmålingen.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketingChecked}
                    onChange={(event) => setMarketingChecked(event.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#2663eb]"
                  />
                </div>
              </label>
            </div>

            {status}
            {savedAt && (
              <p className="mt-4 text-xs text-gray-500">
                Valget ditt ble sist lagret {new Date(savedAt).toLocaleDateString('nb-NO')}.
              </p>
            )}

            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              Trekker du tilbake samtykket, sender vi signaler om tilbaketrekking, sletter kjente markedsføringskapsler
              vi har tilgang til og slutter å laste verktøyene. Leverandørene kan beholde opplysninger de mottok før
              tilbaketrekkingen etter sine egne vilkår.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => void apply('denied')}
                className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-gray-500"
              >
                Bare nødvendige
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void apply(marketingChecked ? 'granted' : 'denied')}
                className="rounded-full bg-[#2663eb] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Lagre valg
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
