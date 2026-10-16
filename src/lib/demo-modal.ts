import { demoDestination } from './marketing-attribution.ts';

/**
 * «Book en demo» som modal: klikk på en lenke til os.notably.no/book/demo åpner bookingen i en iframe over siden.
 * Lenkene er allerede pyntet av trial-clicks (decorateDemo: klikk-id/utm bare med samtykke, ref alltid), så iframen får
 * nøyaktig samme adresse som «ny fane» ville fått – pluss embed=1. Ctrl/⌘/shift/midtklikk åpner fortsatt i ny fane.
 */
export const BOOKING_ORIGIN = 'https://os.notably.no';

export function demoEmbedSrc(href: string): string | null {
  const url = demoDestination(href);
  if (!url) return null;
  url.searchParams.set('embed', '1');
  return url.href;
}

export type BookingMessage = { status: 'ready' } | { status: 'booked'; start: string | null } | { status: 'close' };

/** Bare meldinger fra os.notably.no (og bare fra vår egen iframe når den er oppgitt) med kjent form. */
export function readBookingMessage(event: Pick<MessageEvent, 'origin' | 'data' | 'source'>, frame?: unknown): BookingMessage | null {
  if (event.origin !== BOOKING_ORIGIN) return null;
  if (frame !== undefined && event.source !== frame) return null;
  const d = event.data as { type?: unknown; status?: unknown; start?: unknown } | null;
  if (!d || typeof d !== 'object' || d.type !== 'notably:booking') return null;
  if (d.status === 'ready' || d.status === 'close') return { status: d.status };
  if (d.status === 'booked') return { status: 'booked', start: typeof d.start === 'string' && !Number.isNaN(Date.parse(d.start)) ? d.start : null };
  return null;
}

/** Én delegert klikklytter: vanlig venstreklikk på en demo-lenke → modal i stedet for ny fane. */
export function startDemoModalLinks(open: (src: string, href: string) => void): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const a = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    const src = a ? demoEmbedSrc(a.href) : null;
    if (!a || !src) return;
    event.preventDefault();
    open(src, a.href);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

/** Fokusfelle: Tab/Shift+Tab sirkulerer innenfor modalen. */
export function trapFocus(event: KeyboardEvent, root: HTMLElement): void {
  if (event.key !== 'Tab') return;
  const items = [...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')];
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  const active = root.ownerDocument.activeElement;
  if (event.shiftKey && (active === first || !root.contains(active))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (active === last || !root.contains(active))) { event.preventDefault(); first.focus(); }
}

/** Scroll-lås på body; gjenoppretter tidligere verdier (også scrollbar-kompensasjon). */
export function lockScroll(doc: Document = document): () => void {
  const body = doc.body, win = doc.defaultView;
  const prev = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
  const gap = win ? win.innerWidth - doc.documentElement.clientWidth : 0;
  body.style.overflow = 'hidden';
  if (gap > 0) body.style.paddingRight = `${gap}px`;
  return () => { body.style.overflow = prev.overflow; body.style.paddingRight = prev.paddingRight; };
}
