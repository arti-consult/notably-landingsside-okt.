import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { lockScroll, readBookingMessage, startDemoModalLinks, trapFocus } from '../lib/demo-modal.ts';

/** Etter så lang tid uten «ready» fra bookingsiden vises «Åpne i ny fane» (iframe blokkert, treg linje, nettverksfeil). */
export const FALLBACK_MS = 8000;

const fmtStart = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  const day = d.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Oslo' });
  const time = d.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo' });
  return `${day} kl. ${time}`;
};

/**
 * «Book en demo»: bookingen i Notably OS i en modal over siden (iframe mot os.notably.no/book/demo?embed=1).
 * ESC, klikk utenfor og lukkeknappen lukker; fokusfelle og scroll-lås; fullskjerm på mobil (≤640px).
 */
export default function DemoBookingModal() {
  const [open, setOpen] = useState<{ src: string; href: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const [booked, setBooked] = useState<{ start: string | null } | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => startDemoModalLinks((src, href) => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setReady(false); setSlow(false); setBooked(null);
    setOpen({ src, href });
  }), []);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const timer = window.setTimeout(() => setSlow(true), FALLBACK_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (dialog.current) trapFocus(e, dialog.current);
    };
    // Fokus som forlater modalen (f.eks. Tab ut av iframen) hentes tilbake.
    const onFocus = (e: FocusEvent) => { if (dialog.current && e.target instanceof Node && !dialog.current.contains(e.target)) dialog.current.querySelector<HTMLElement>('[data-close]')?.focus(); };
    const onMessage = (e: MessageEvent) => {
      const m = readBookingMessage(e, frame.current?.contentWindow ?? undefined);
      if (!m) return;
      if (m.status === 'ready') { setReady(true); window.clearTimeout(timer); setSlow(false); }
      else if (m.status === 'booked') setBooked({ start: m.start });
      else close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    window.addEventListener('message', onMessage);
    requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>('[data-close]')?.focus());
    return () => {
      unlock(); window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocus);
      window.removeEventListener('message', onMessage);
      opener.current?.focus?.();
    };
  }, [open, close]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="demo-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[120] flex items-center justify-center sm:p-6"
          data-demo-modal
        >
          <button type="button" tabIndex={-1} aria-label="Lukk bookingvindu" onClick={close} className="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-sm" data-demo-backdrop />
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[min(760px,calc(100dvh-48px))] sm:max-w-[1040px] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-2.5 sm:px-6 sm:py-3">
              <div className="min-w-0">
                <h2 id="demo-modal-title" className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Book en demo</h2>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a href={open.href} target="_blank" rel="noopener noreferrer" onClick={close}
                  className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:inline-flex">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />Åpne i ny fane
                </a>
                <button type="button" data-close onClick={close} aria-label="Lukk"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Bekreftelsen vises i iframen (Møtet er booket + detaljer) – her bare kunngjort for skjermlesere, ingen dobbel banner. */}
            {booked && (
              <p role="status" className="sr-only" data-demo-booked>
                Demoen er booket{booked.start ? ` – ${fmtStart(booked.start)}` : ''}. Invitasjonen er på vei til e-posten din.
              </p>
            )}

            <div className="relative min-h-0 flex-1 bg-white">
              {!ready && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white text-slate-500" aria-live="polite" data-demo-loading>
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" aria-hidden="true" />
                  <span className="text-sm">Henter ledige tider …</span>
                  {slow && (
                    <p className="mt-2 max-w-xs text-center text-sm" data-demo-fallback>
                      Tar det tid?{' '}
                      <a href={open.href} target="_blank" rel="noopener noreferrer" onClick={close} className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">Åpne i ny fane</a>
                    </p>
                  )}
                </div>
              )}
              <iframe
                ref={frame}
                src={open.src}
                title="Book en demo med Notably"
                className={`h-full w-full border-0 transition-opacity duration-200 ${ready ? 'opacity-100' : 'opacity-0'}`}
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
