export const SCROLL_TO_SECTION_EVENT = 'notably:scroll-to-section';

export function requestScrollToSection(id: string) {
  window.dispatchEvent(new CustomEvent<string>(SCROLL_TO_SECTION_EVENT, { detail: id }));
}

/**
 * Scrolls to a section that may not be in the DOM yet (lazy/deferred rendering).
 * Waits for the element to appear, then keeps it aligned while lazy content above
 * it settles, until the user scrolls themselves or the settle window ends.
 */
export function scrollToSectionWhenReady(id: string, { timeout = 5000, settleMs = 2000 } = {}) {
  let cancelled = false;
  let frame = 0;
  let resizeObserver: ResizeObserver | null = null;
  let settleTimer = 0;
  const start = performance.now();

  const stopSettling = () => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    window.clearTimeout(settleTimer);
    window.removeEventListener('wheel', stopSettling);
    window.removeEventListener('touchstart', stopSettling);
    window.removeEventListener('keydown', stopSettling);
  };

  const tryScroll = () => {
    if (cancelled) return;

    const element = document.getElementById(id);
    if (!element) {
      if (performance.now() - start < timeout) {
        frame = requestAnimationFrame(tryScroll);
      }
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });

    let realignFrame = 0;
    resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(realignFrame);
      realignFrame = requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    resizeObserver.observe(document.body);
    window.addEventListener('wheel', stopSettling, { passive: true });
    window.addEventListener('touchstart', stopSettling, { passive: true });
    window.addEventListener('keydown', stopSettling);
    settleTimer = window.setTimeout(stopSettling, settleMs);
  };

  frame = requestAnimationFrame(tryScroll);

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
    stopSettling();
  };
}
