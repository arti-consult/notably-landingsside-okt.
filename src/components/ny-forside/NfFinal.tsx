import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { PrimaryCta, SecondaryCta } from './shared';

const BARS = 28;

/**
 * Avslutningen. Lydbølgen samler seg til de tre linjene fra logoen mens man
 * scroller inn: tale blir til referat.
 */
export default function NfFinal() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const barsScale = useTransform(scrollYProgress, [0.15, 0.75], [1, 0.04]);
  const barsOpacity = useTransform(scrollYProgress, [0.55, 0.8], [1, 0]);
  const line1 = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);
  const line2 = useTransform(scrollYProgress, [0.66, 0.9], [0, 1]);
  const line3 = useTransform(scrollYProgress, [0.72, 0.95], [0, 1]);
  const lines = [line1, line2, line3];

  return (
    <section ref={ref} data-ph-section="final_cta" data-hide-sticky-cta className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#080B12] px-5 py-24 text-center text-white sm:py-32">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/40 glow scale-150" />

        {/* Fra lyd til linjer */}
        <div className="relative mx-auto h-24 w-40" aria-hidden>
          {!reduced && (
            <motion.div style={{ scaleY: barsScale, opacity: barsOpacity }} className="absolute inset-0 flex items-center justify-center gap-[3px]">
              {Array.from({ length: BARS }, (_, i) => (
                <span
                  key={i}
                  className="notably-wave-bar w-[3px] rounded-full bg-blue-400"
                  style={{ height: `${25 + Math.abs(Math.sin(i * 0.7)) * 75}%`, animationDelay: `${(i % 6) * 0.12}s` }}
                />
              ))}
            </motion.div>
          )}
          <div className="absolute inset-0 flex flex-col justify-center gap-[10px] px-6">
            {[1, 1, 0.55].map((w, i) => (
              <div key={i} style={{ width: `${w * 100}%` }}>
                <motion.span style={reduced ? undefined : { scaleX: lines[i] }} className="block h-[13px] origin-left bg-white" />
              </div>
            ))}
          </div>
        </div>

        <h2 className="relative mx-auto mt-12 max-w-4xl text-balance text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[6rem]">
          Neste møte skriver seg selv.
        </h2>
        <p className="relative mx-auto mt-7 max-w-lg text-lg leading-relaxed text-slate-400">
          Koble til kalenderen, så er Notably med på neste møte. Prøv gratis i 14 dager, med full tilgang.
        </p>
        <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <PrimaryCta placement="bottom" light>
            Start gratis
          </PrimaryCta>
          <SecondaryCta placement="bottom" dark />
        </div>
      </div>
    </section>
  );
}
