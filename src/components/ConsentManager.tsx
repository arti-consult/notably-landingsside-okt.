import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { onOpenPrivacyChoices, readConsent, saveConsent, type ConsentValue } from '../lib/consent';
import { isMarketingTrackingActive, revokeMarketingTracking } from '../lib/analytics';

/**
 * Banner + Personvernvalg-panel.
 *
 * Banneret vises til brukeren har tatt et valg. Panelet kan åpnes igjen når som
 * helst fra footeren eller personvernerklæringen, slik erklæringen lover.
 *
 * Selve lastingen av sporingsskriptene eies av MarketingScriptsLoader i
 * `main.tsx`, som lytter på samtykkeendringene herfra – slik finnes det bare ett
 * sted som starter verktøyene. Her håndteres tilbaketrekkingen: revoke-signaler,
 * sletting av kapsler og en ny sidelasting som fjerner skriptene fra DOM-en.
 */
export default function ConsentManager() {
  const [decided, setDecided] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const syncFromStorage = useCallback(() => {
    const stored = readConsent();
    setDecided(stored !== null);
    setMarketingChecked(stored?.marketing === 'granted');
    setSavedAt(stored?.updatedAt ?? null);
  }, []);

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  useEffect(
    () =>
      onOpenPrivacyChoices(() => {
        syncFromStorage();
        setPanelOpen(true);
      }),
    [syncFromStorage],
  );

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

  const apply = useCallback((value: ConsentValue) => {
    const wasActive = isMarketingTrackingActive();
    saveConsent(value);
    setDecided(true);
    setMarketingChecked(value === 'granted');
    setPanelOpen(false);

    if (value === 'granted') {
      // MarketingScriptsLoader starter verktøyene på samtykkehendelsen.
      return;
    }

    revokeMarketingTracking();
    if (wasActive) {
      // Skriptene ligger fortsatt i DOM-en; en ny lasting fjerner dem helt.
      window.location.reload();
    }
  }, []);

  if (decided && !panelOpen) {
    return null;
  }

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
              Vi bruker nødvendige informasjonskapsler for at nettstedet skal fungere. Valgfrie analyse- og
              markedsføringsverktøy er avslått til du tillater dem. Les mer i{' '}
              <Link to="/personvern" className="text-blue-400 underline underline-offset-2 hover:text-blue-300">
                personvernerklæringen
              </Link>
              .
            </p>

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
                onClick={() => apply('denied')}
                className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-gray-500"
              >
                Bare nødvendige
              </button>
              <button
                type="button"
                onClick={() => apply('granted')}
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
              Her styrer du valgfrie analyse- og markedsføringsverktøy på notably.no. Du kan endre valget når som helst.
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
                      nettidentifikatorer og begrensede opplysninger om side, henviser, nettleser, enhet og samhandling.
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
                onClick={() => apply('denied')}
                className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-gray-500"
              >
                Bare nødvendige
              </button>
              <button
                type="button"
                onClick={() => apply(marketingChecked ? 'granted' : 'denied')}
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
