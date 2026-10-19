import { trackDemoEvent } from './analytics.ts';
import type { BookingMessage } from './demo-modal.ts';
import { publicPagePath } from './marketing-policy.ts';
import { captureLandingEvent } from './posthog-landing.ts';

// Page-memory only: no extra cookies/storage and no replay after a later consent grant.
const seenBookings = new WeakMap<Window, Set<string>>();

/** One user-opened modal. The caller must validate the iframe's origin and source before passing a message. */
export function startDemoTracking(anchor: HTMLAnchorElement, trusted: boolean): (message: BookingMessage) => void {
  const pagePath = publicPagePath(new URL(window.location.href));
  if (!trusted || !pagePath) return () => {};
  const raw = anchor.dataset.demoCta ?? (anchor.closest('nav,header') ? 'navigation' : anchor.closest('footer') ? 'footer' : anchor.closest('section[id]')?.id ?? 'content');
  const params = { button_id: /^[a-z0-9_-]{1,64}$/.test(raw) ? raw : 'content', page_path: pagePath };
  const seen = seenBookings.get(window) ?? new Set<string>();
  seenBookings.set(window, seen);
  try { trackDemoEvent('demo_click', params); } catch { /* Booking remains usable if measurement fails. */ }
  captureLandingEvent('demo_click', params);
  return (message) => {
    if (message.status !== 'booked' || !message.confirmation) return;
    const id = message.confirmation.id;
    if (seen.has(id)) return;
    seen.add(id); // Consume even without consent: never send a previously unconsented booking later.
    try { trackDemoEvent('demo_booked', params, `demo_${id}`); } catch { /* No queued retries. */ }
    captureLandingEvent('demo_booked', params);
  };
}
