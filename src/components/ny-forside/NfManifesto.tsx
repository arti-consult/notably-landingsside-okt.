import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Label } from './shared';

const TEXT =
  'Du sitter i møtet og skriver i stedet for å lytte. Klokka ni på kvelden skriver du referatet. På fredag husker ingen hva som ble avtalt.';

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/**
 * Problemet, fortalt som én setning som skrives fram mens man scroller. Ordene
 * går fra nesten usynlige til fulle i takt med scrollen, og poenget kommer til
 * slutt i blått.
 */
export default function NfManifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = TEXT.split(' ');

  return (
    <section data-ph-section="problem" className="px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <Label>Kjenner du deg igjen?</Label>
        <div
          ref={ref}
          className="mt-8 text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[1.08]"
        >
          {reduced ? (
            <p>{TEXT}</p>
          ) : (
            <p>
              {words.map((w, i) => {
                const start = i / words.length;
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]}>
                    {w}
                  </Word>
                );
              })}
            </p>
          )}
        </div>
        <p className="mt-10 text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-blue-600 sm:text-5xl lg:text-[3.6rem]">
          Med Notably kan du bare lytte. Referatet skriver seg selv.
        </p>
      </div>
    </section>
  );
}
