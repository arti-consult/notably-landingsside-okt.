import { Suspense, startTransition, useEffect, useRef, useState, type ReactNode } from 'react';

type DeferredRenderProps = {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
  forceRender?: boolean;
  /** Høyde på plassholderen mens innholdet lastes, så siden ikke får en falsk bunn. */
  placeholderHeight?: string;
};

/** Hero-inngangen og skriveeffekten er ferdige omtrent 1,5 s etter visning. */
const IDLE_START_DELAY_MS = 1500;

/**
 * Venter med innholdet under bretten til første skjerm er tegnet, og laster det
 * så i bakgrunnen når nettleseren er ledig. Tidligere ble alt hentet først når
 * man nærmet seg bunnen, og på mobil scrollet man inn i en tom side som stoppet
 * og deretter hoppet ut når 16 filer var lastet.
 */
export default function DeferredRender({
  children,
  rootMargin = '300px 0px',
  threshold = 0,
  forceRender = false,
  placeholderHeight = '200vh',
}: DeferredRenderProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const rendering = shouldRender || forceRender;

  // Lavt prioritert: litt etter load, når hero-animasjonen er ferdig og
  // hovedtråden er ledig. Som transition kan React dele opp arbeidet og slippe
  // til scroll og input underveis.
  useEffect(() => {
    if (rendering) return;

    let idleId = 0;
    let timeoutId = 0;
    const start = () => startTransition(() => setShouldRender(true));
    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        // Safari mangler requestIdleCallback.
        if (typeof window.requestIdleCallback === 'function') {
          idleId = window.requestIdleCallback(start, { timeout: 1000 });
        } else {
          start();
        }
      }, IDLE_START_DELAY_MS);
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      window.removeEventListener('load', schedule);
      if (idleId) window.cancelIdleCallback?.(idleId);
      window.clearTimeout(timeoutId);
    };
  }, [rendering]);

  // Høyt prioritert: brukeren er allerede på vei ned.
  useEffect(() => {
    if (rendering) return;

    const placeholder = placeholderRef.current;
    if (!placeholder) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldRender(true);
      },
      { rootMargin, threshold }
    );

    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [rendering, rootMargin, threshold]);

  const placeholder = (
    <div ref={placeholderRef} aria-hidden className="w-full" style={{ minHeight: placeholderHeight }} />
  );

  if (!rendering) return placeholder;

  // Plassholderen står også mens de lazy-lastede seksjonene hentes.
  return <Suspense fallback={placeholder}>{children}</Suspense>;
}
