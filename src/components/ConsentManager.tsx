import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import { consentClient, onConsentChange, onOpenPrivacyChoices, readConsent, saveConsent, type ConsentValue } from '../lib/consent';

/** Shared server consent; SDK lifecycle and immediate revocation live in marketing-loader. */
export default function ConsentManager() {
  const [view, setView] = useState(readConsent);
  const [panelOpen, setPanelOpen] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const savedAt = view.response?.consent.decidedAt;
  const decided = view.phase === 'ready' && !view.pendingDenial &&
    (view.granted || ['rejected', 'withdrawn'].includes(view.response?.consent.state ?? ''));
  const message = saving ? 'Lagrer personvernvalget …' : view.phase === 'disabled'
    ? 'Valgfrie verktøy er av i denne forhåndsvisningen.' : view.pendingDenial
    ? 'Valgfrie verktøy er av her. Vi prøver å synkronisere avslaget med webappen. Du kan prøve igjen nedenfor.'
    : view.phase === 'error' ? 'Vi kunne ikke hente eller lagre personvernvalget. Valgfrie verktøy er av. Prøv igjen.' : null;

  useEffect(() => onConsentChange(() => setView(readConsent())), []);
  useEffect(() => onOpenPrivacyChoices(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
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
        'button:not(:disabled), a[href], input:not(:disabled), summary, [tabindex]:not([tabindex="-1"])',
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
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
    };
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
  const choiceButton = 'min-h-11 w-full rounded-xl bg-[#2663eb] px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60';
  const textLink = 'rounded text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600';
  const status = message && <div role="status" aria-live="polite" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
    {message}
    {!saving && view.phase !== 'disabled' && <button type="button" onClick={() => void retry()} className="ml-2 underline">Prøv igjen</button>}
  </div>;

  if ((decided || view.phase === 'loading') && !panelOpen && !view.pendingDenial) return null;

  return (
    <>
      {!decided && !panelOpen && (
        <section
          aria-labelledby="cookie-banner-title"
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[min(36rem,calc(100vw-3rem))] sm:p-0"
        >
          <div className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_8px_40px_rgba(15,23,42,0.16)] sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600" aria-hidden="true">
                <Cookie className="h-5 w-5" />
              </span>
              <h2 id="cookie-banner-title" className="text-lg font-semibold tracking-tight">Informasjonskapsler hos Notably</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Vi bruker informasjonskapsler og lignende teknologi for å forstå hvordan nettsiden brukes og hvilke annonser som virker.
              Med ditt samtykke deler vi nettidentifikatorer, besøk og klikk med Google, Meta og TikTok, og prøvestart med Google og Meta.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Valget gjelder nettsiden og webappen. Du kan endre det når som helst i Personvernvalg.
            </p>
            {status}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => void apply('denied')} className={choiceButton}>
                Avvis alle
              </button>
              <button type="button" disabled={saving} onClick={() => void apply('granted')} className={choiceButton}>
                Godta alle
              </button>
            </div>
            <div className="mt-3 flex min-h-8 flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <button type="button" onClick={(event) => { returnFocusRef.current = event.currentTarget; setMarketingChecked(readConsent().granted); setPanelOpen(true); }} className={textLink}>
                Personvernvalg
              </button>
              <Link to="/personvern" className={textLink}>Les om personvern</Link>
            </div>
          </div>
        </section>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/40 p-3 sm:items-center sm:p-6">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="personvernvalg-tittel"
            aria-describedby="personvernvalg-beskrivelse"
            className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:max-h-[85dvh]"
          >
            <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-4 sm:px-6">
              <h2 id="personvernvalg-tittel" className="text-xl font-semibold tracking-tight">Personvernvalg</h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Lukk personvernvalg"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto px-5 pb-5 pt-2 sm:px-6">
              <p id="personvernvalg-beskrivelse" className="text-sm leading-relaxed text-slate-600">
                Velg om du vil tillate analyse og markedsføring på nettsiden og i webappen. Du kan bruke Notably uansett hva du velger.
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold">Nødvendige informasjonskapsler</h3>
                  <span className="shrink-0 text-xs font-medium text-slate-500">Alltid på</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  Sørger for sikkerhet, innlogging og at personvernvalget ditt blir husket.
                </p>
              </div>

              <label className="mt-3 block cursor-pointer rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-300">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-semibold">Analyse og markedsføring</span>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Måler bruk av nettsiden og effekten av annonsene våre med Google, Meta og TikTok.
                      Google og Meta mottar også klikk på «Start gratis» og bekreftet prøvestart.
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

              <details className="mt-4 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                <summary className="cursor-pointer font-medium text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
                  Hva deles, og hvor lenge?
                </summary>
                <div className="mt-3 space-y-3 leading-relaxed">
                  <p>
                    Verktøyene mottar nettidentifikatorer og opplysninger om offentlige sider, henviser, nettleser,
                    enhet og samhandling. Prøvestartmålingen inneholder ikke møteinnhold, navn, e-post eller betalingsbeløp.
                  </p>
                  <p>
                    Valget lagres i opptil 180 dager. Notably lagrer annonseopplysninger i opptil 90 dager,
                    begrenset av samtykkets varighet. Leverandørene har egne lagringstider.
                  </p>
                  <p>
                    Ved tilbaketrekking stopper ny sporing og sendinger som ikke allerede er sendt.
                    Vi sletter kjente markedsføringskapsler vi har tilgang til. Leverandørene kan beholde
                    tidligere mottatte opplysninger etter sine vilkår.
                  </p>
                </div>
              </details>

              {status}
              {savedAt && <p className="mt-3 text-xs text-slate-500">Sist lagret {new Date(savedAt).toLocaleDateString('nb-NO')}.</p>}
              <p className="mt-4 text-sm text-slate-600">
                Du kan endre valget når som helst via Personvernvalg.{' '}
                <Link to="/personvern" onClick={() => setPanelOpen(false)} className={textLink}>Les mer</Link>
              </p>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-slate-200 bg-white p-4 sm:px-6">
              <button type="button" onClick={() => void apply('denied')} className={choiceButton}>Avvis alle</button>
              <button type="button" disabled={saving} onClick={() => void apply(marketingChecked ? 'granted' : 'denied')} className={choiceButton}>Lagre valg</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
