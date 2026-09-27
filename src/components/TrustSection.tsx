import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Kundelogoene ligger beskåret i public/logos/kunder, så raden ikke er avhengig
 * av databasen. `scale` jevner ut optisk størrelse: brede ordmerker krymper,
 * kvadratiske og stablede logoer får litt mer høyde.
 */
const logos = [
  { name: 'Pharma Nordic', src: '/logos/kunder/pharma-nordic.svg', scale: 0.72 },
  { name: 'Møbelringen', src: '/logos/kunder/mobelringen.webp', scale: 1.25 },
  { name: 'Brave', src: '/logos/kunder/brave.webp', scale: 0.85 },
  { name: '1881', src: '/logos/kunder/1881.webp', scale: 1.35 },
  { name: 'Breivik Eiendom', src: '/logos/kunder/breivik-eiendom.svg', scale: 0.72 },
  { name: 'Verdsette', src: '/logos/kunder/verdsette.webp', scale: 0.78 },
  { name: 'TOR Entreprenør', src: '/logos/kunder/tor-entreprenor.webp', scale: 1.2 },
  { name: 'Bø kommune', src: '/logos/kunder/bo-kommune.webp', scale: 1.1 },
  { name: 'HTB', src: '/logos/kunder/htb.webp', scale: 1.1 },
  { name: 'øh', src: '/logos/kunder/oh.svg', scale: 1 },
];

/** Fart i piksler per sekund – lik på alle skjermer, uansett hvor lang raden blir. */
const SPEED = 42;

const LogoRow = ({ hidden = false }: { hidden?: boolean }) => (
  <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
    {logos.map(({ name, src, scale }) => (
      <li key={name} className="flex shrink-0 items-center">
        <img
          src={src}
          alt={hidden ? '' : name}
          decoding="async"
          style={{ height: `calc(var(--logo-h) * ${scale})` }}
          className="w-auto opacity-80 transition-opacity duration-300 hover:opacity-100"
        />
      </li>
    ))}
  </ul>
);

export default function TrustSection() {
  const prefersReducedMotion = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(45);

  // Varigheten regnes ut fra radens faktiske bredde. En fast varighet gjør at
  // logoene går saktere på mobil, der logoene og mellomrommene er mindre.
  useEffect(() => {
    const row = rowRef.current?.firstElementChild;
    if (!row) return;
    const update = () => setDuration(row.getBoundingClientRect().width / SPEED);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section className="relative z-10 bg-white pb-8 pt-2 sm:pb-10">
      <p className="page-container text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-sm">
        Brukt av team hos
      </p>

      {prefersReducedMotion ? (
        // Uten bevegelse: én rolig rad som brytes over flere linjer.
        <div className="page-container mt-6 [--logo-h:26px] sm:[--logo-h:30px]">
          <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map(({ name, src, scale }) => (
              <li key={name}>
                <img
                  src={src}
                  alt={name}
                  decoding="async"
                  style={{ height: `calc(var(--logo-h) * ${scale})` }}
                  className="w-auto opacity-80"
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Løkken: listen ligger to ganger etter hverandre, og sporet flyttes
        // -50 %, så den andre kopien lander nøyaktig der den første startet.
        <div className="group relative mt-6 overflow-hidden [--logo-h:26px] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:[--logo-h:30px] lg:[--logo-h:32px]">
          {/* Pausen gjelder bare enheter med ekte peker – på mobil blir
              :hover hengende etter et trykk og stopper rullingen. */}
          <div
            ref={rowRef}
            className="notably-marquee flex w-max [@media(hover:hover)]:group-hover:[animation-play-state:paused]"
            style={{ animationDuration: `${duration}s` }}
          >
            <LogoRow />
            <LogoRow hidden />
          </div>
        </div>
      )}
    </section>
  );
}
