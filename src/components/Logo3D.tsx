import { useEffect, useRef, useState } from 'react';
import type { LogoScene } from './logoScene';

/**
 * 3D-logoen i CTA-seksjonen.
 *
 * Three.js koster over 100 KB brotli, så scenen importeres dynamisk og først
 * når seksjonen nærmer seg viewporten. Alle som ikke scroller helt ned laster
 * den aldri. Selve modellen er 21 KB brotli.
 *
 * Feiler WebGL – eller er det skrudd av – blir fallback-bildet stående.
 */
export default function Logo3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let scene: LogoScene | undefined;

    const start = async () => {
      try {
        const { mountLogoScene } = await import('./logoScene');
        if (disposed) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mounted = await mountLogoScene(host, { reducedMotion });

        if (disposed) {
          mounted.dispose();
          return;
        }
        scene = mounted;
        setReady(true);
      } catch {
        // Fallback-bildet står allerede der, så det er ikke noe mer å gjøre.
      }
    };

    const trigger = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trigger.disconnect();
        void start();
      },
      { rootMargin: '400px 0px' }
    );
    trigger.observe(host);

    return () => {
      disposed = true;
      trigger.disconnect();
      scene?.dispose();
    };
  }, []);

  return (
    <div className="relative mx-auto mb-10 aspect-square w-28 sm:w-32 md:w-36">
      <div ref={hostRef} className="absolute inset-0" aria-hidden />
      {!ready && (
        <img
          src="/notably-logo-3d-fallback.png"
          alt="Notably"
          className="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
