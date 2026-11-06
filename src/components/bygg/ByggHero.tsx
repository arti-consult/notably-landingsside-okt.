import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Check, HardHat } from 'lucide-react';
import { PrimaryCta, SecondaryCta, ease } from '../advokat/shared';
import ByggHeroVisual from './ByggHeroVisual';

const proofPoints = ['iPhone og Android', 'Lagret i EU', '14 dager gratis'];

export default function ByggHero() {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
  };
  const line: Variants = {
    hidden: reduced ? { opacity: 0 } : { y: '112%' },
    visible: { opacity: 1, y: '0%', transition: { duration: 0.85, ease } },
  };

  return (
    <section
      data-ph-section="hero"
      className="relative overflow-hidden px-6 pb-14 pt-28 sm:px-10 sm:pt-36 md:px-[8%] lg:pb-20 xl:px-[11%]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-48 h-[24rem] w-[24rem] rounded-full bg-sky-300/20 glow scale-[1.86] lg:-top-40 lg:right-[-10%] lg:h-[38rem] lg:w-[38rem] lg:bg-blue-400/20 lg:scale-[1.64]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-[55%] h-[20rem] w-[20rem] rounded-full bg-amber-200/25 glow scale-[2.03] lg:-left-[12%] lg:top-16 lg:h-[26rem] lg:w-[26rem] lg:bg-amber-200/30 lg:scale-[1.87]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.p
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 py-1.5 pl-1.5 pr-3.5 text-sm font-medium text-slate-700 backdrop-blur"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400">
                <HardHat className="h-3.5 w-3.5 text-slate-900" aria-hidden />
              </span>
              For bygg og anlegg
            </motion.p>

            <motion.h1
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              className="mt-6 text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.03em] text-slate-800 sm:text-[3.4rem] lg:text-[3.3rem] xl:text-[3.9rem]"
            >
              <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                <motion.span variants={line} className="block">
                  Byggemøtet er ferdig.
                </motion.span>
              </span>{' '}
              <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                <motion.span
                  variants={line}
                  className="block bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-[CanvasText]"
                >
                  Referatet også.
                </motion.span>
              </span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-md text-lg leading-relaxed text-slate-600 sm:text-xl">
              Legg telefonen på bordet i brakka. Notably skriver hvem som sa hva, hvem som gjør hva og innen når. Du
              sender referatet før du går ut døra.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryCta placement="hero">Prøv gratis i 14 dager</PrimaryCta>
              <SecondaryCta demoPlacement="hero">Book demo for firmaet</SecondaryCta>
            </motion.div>

            <motion.ul variants={item} className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {proofPoints.map((point) => (
                <li key={point} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} aria-hidden />
                  {point}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <ByggHeroVisual />
        </div>
      </div>
    </section>
  );
}
