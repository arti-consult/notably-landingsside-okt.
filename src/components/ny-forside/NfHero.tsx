import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Check } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import LiveMeeting from './LiveMeeting';
import { NorwayFlag, PrimaryCta, SecondaryCta, ease } from './shared';

const platforms = [
  { name: 'Teams', src: '/media/1762605154714.svg' },
  { name: 'Google Meet', src: '/media/1762605184963.svg' },
  { name: 'Zoom' },
  { name: 'Fysiske møter' },
];

/** Tre påstander som kan etterprøves i personvernerklæringen. */
const trust = ['Lagret i EU', 'Aldri brukt til AI-trening', 'Databehandleravtale inkludert'];

export default function NfHero() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const tilt = desktop && !reduced;

  // Kortet ligger vippet bakover og retter seg opp mens man scroller inn i det.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'center center'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };
  const word: Variants = {
    hidden: reduced ? { opacity: 0 } : { y: '110%' },
    visible: { opacity: 1, y: '0%', transition: { duration: 0.9, ease } },
  };

  const line1 = ['Vær', 'til', 'stede.'];
  const line2 = ['Notably', 'skriver', 'referatet.'];

  return (
    <section data-ph-section="hero" className="relative overflow-hidden pb-10 pt-28 sm:pt-32">
      {/* Svakt rutenett, som linjert papir, som toner ut nedover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_bottom,rgba(11,15,25,0.045)_1px,transparent_1px)] [background-size:100%_44px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[28rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-blue-500/15 glow scale-150"
      />

      <motion.div variants={container} initial="hidden" animate="visible" className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.p
          variants={item}
          className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-2 pr-3.5 text-[13px] font-medium text-slate-700 shadow-[0_6px_20px_-12px_rgba(11,15,25,0.4)] ring-1 ring-slate-900/5"
        >
          <NorwayFlag className="h-3.5 w-auto" />
          AI-møteassistenten laget for norske team
        </motion.p>

        <h1 className="mt-7 text-[2.75rem] font-semibold leading-[1] tracking-[-0.045em] text-slate-950 sm:text-[5rem] lg:text-[5.6rem] xl:text-[6.1rem]">
          <motion.span variants={container} className="block">
            {line1.map((w) => (
              <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0">
                <motion.span variants={word} className="inline-block">
                  {w}
                </motion.span>
              </span>
            ))}
          </motion.span>
          <motion.span variants={container} className="block">
            {line2.map((w) => (
              <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0">
                <motion.span variants={word} className="inline-block text-blue-600">
                  {w}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </h1>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.p variants={item} className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-[1.3rem] sm:leading-[1.55]">
            Notably blir med i Teams, Zoom og Google Meet, eller tar opp på mobilen når dere sitter rundt et bord. Når
            møtet er slutt, ligger referatet klart. Med beslutninger, oppgaver og hvem som sa hva.
          </motion.p>
          <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <PrimaryCta placement="hero" />
            <SecondaryCta placement="hero" />
          </motion.div>
        </div>

        <motion.ul variants={item} className="mt-7 flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
          {trust.map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-sm text-slate-600">
              <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} aria-hidden />
              {t}
            </li>
          ))}
        </motion.ul>

      </motion.div>

      <div ref={stageRef} className="relative mx-auto mt-12 max-w-6xl px-3 sm:mt-14 sm:px-8 [perspective:1600px]">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease }}
        >
          <motion.div
            style={tilt ? { rotateX, scale, transformOrigin: '50% 100%' } : undefined}
            className={tilt ? 'will-change-transform' : undefined}
          >
            <LiveMeeting />
          </motion.div>
        </motion.div>
      </div>

      <motion.ul variants={item} initial="hidden" animate="visible" className="relative mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-center gap-2 px-5 sm:px-8" aria-label="Fungerer med">
        <li className="mr-1 text-sm text-slate-500">Fungerer med</li>
        {platforms.map(({ name, src }) => (
          <li
            key={name}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[13px] font-medium text-slate-700 ring-1 ring-slate-900/[0.06]"
          >
            {src && <img src={src} alt="" className="h-4 w-4 object-contain" />}
            {name}
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
