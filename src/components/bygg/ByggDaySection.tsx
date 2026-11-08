import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Check, Send } from 'lucide-react';
import { Eyebrow, PrimaryCta, SectionHeading, ease } from '../advokat/shared';

/**
 * Samme møte to ganger: en rotete notatblokk mot et ferdig referat.
 * Forskjellen skal sees på et sekund, så nesten alt er bilde og nesten ingenting er tekst.
 * Referatet er det samme møtet som telefonen i heroen viser.
 */

const INK = '#3B5BA9';

/** Kruseduller i stedet for ord: bredde i prosent og en fast «tilfeldig» bølge per linje. */
const scribbles = [
  { width: 78, seed: [3, -4, 2, -3, 4, -2, 3, -4, 2, -3, 3, -2] },
  { width: 52, seed: [-3, 4, -2, 3, -4, 2, -3, 3], question: true },
  { width: 88, seed: [2, -3, 4, -2, 3, -4, 2, -3, 3, -2, 4, -3, 2], struck: true },
  { width: 40, seed: [4, -3, 2, -4, 3, -2] },
  { width: 64, seed: [-2, 3, -4, 2, -3, 4, -2, 3, -3] },
];

/** Viewbox-bredden følger omtrent den faktiske bredden, så streken ikke blir strukket. */
const PX_PER_PERCENT = 3;

function wiggle(seed: number[], length: number) {
  const step = length / seed.length;
  return seed.reduce((d, amp, i) => `${d} Q ${i * step + step / 2} ${10 + amp * 1.6} ${(i + 1) * step} 10`, 'M 2 10');
}

const decisions = [
  { text: 'Sjakt S3 flyttes 40 cm' },
  { text: 'Marius sender varsel', due: 'Onsdag' },
  { text: 'ARK leverer tegninger', due: 'Fredag' },
];

function Notebook({ reduced }: { reduced: boolean | null }) {
  const draw = (i: number) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.7, delay: 0.3 + i * 0.25, ease: 'easeInOut' as const },
        };

  return (
    <div
      aria-hidden
      className="relative h-full min-h-[15rem] -rotate-[1.5deg] overflow-hidden rounded-2xl bg-[#FFFDF5] pb-6 pl-12 pr-6 pt-8 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.45)] ring-1 ring-inset ring-amber-900/10"
      style={{
        backgroundImage:
          'linear-gradient(to right, transparent 2.1rem, rgba(244,63,94,0.35) 2.1rem, rgba(244,63,94,0.35) calc(2.1rem + 1px), transparent calc(2.1rem + 1px)), repeating-linear-gradient(to bottom, transparent 0, transparent calc(2rem - 1px), rgba(59,91,169,0.16) calc(2rem - 1px), rgba(59,91,169,0.16) 2rem)',
        backgroundPosition: '0 0, 0 0',
      }}
    >
      {scribbles.map(({ width, seed, question, struck }, i) => (
        <div key={i} className="relative flex h-8 items-end pb-1">
          <svg
            viewBox={`0 0 ${width * PX_PER_PERCENT} 20`}
            preserveAspectRatio="none"
            className="h-5 overflow-visible"
            style={{ width: `${width}%` }}
          >
            <motion.path
              d={wiggle(seed, width * PX_PER_PERCENT - 4)}
              fill="none"
              stroke={INK}
              strokeWidth={2.2}
              strokeLinecap="round"
              {...draw(i)}
            />
            {struck && (
              <motion.path
                d={`M ${width * 0.4} 9 L ${width * 1.9} 12`}
                fill="none"
                stroke={INK}
                strokeWidth={2.4}
                strokeLinecap="round"
                {...draw(i + 0.6)}
              />
            )}
          </svg>
          {question && (
            <span className="ml-3 flex h-7 w-7 -translate-y-0.5 items-center justify-center rounded-full border-2 font-semibold" style={{ borderColor: INK, color: INK }}>
              ?
            </span>
          )}
        </div>
      ))}

      {/* Kaffekoppen satt igjen et merke. */}
      <span className="absolute -bottom-5 right-5 h-24 w-24 rounded-full border-[5px] border-amber-800/15" />
      <span className="absolute -bottom-3 right-8 h-20 w-20 rounded-full border-2 border-amber-800/10" />
    </div>
  );
}

function Referat() {
  return (
    <div
      aria-hidden
      className="flex h-full min-h-[15rem] flex-col rounded-2xl bg-white p-6 shadow-[0_30px_70px_-40px_rgba(37,99,235,0.55)] ring-2 ring-blue-600 sm:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-semibold tracking-tight text-slate-900">Referat</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
          <Send className="h-3 w-3" aria-hidden />
          Sendt
        </span>
      </div>

      <ul className="mt-5 flex flex-1 flex-col justify-center gap-2.5">
        {decisions.map(({ text, due }) => (
          <li key={text} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-3 ring-1 ring-inset ring-slate-200/70">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </span>
            <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-slate-900">{text}</span>
            {due && <span className="shrink-0 text-xs font-medium text-slate-500">{due}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ByggDaySection() {
  const reduced = useReducedMotion();
  const fadeUp = (delay = 0): Variants => ({
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease } },
  });

  return (
    <section data-ph-section="problem" className="page-container bg-white pb-20 pt-16 sm:pb-24 sm:pt-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Etter møtet</Eyebrow>
          <SectionHeading className="mt-5" lead="Samme møte." muted="To helt forskjellige kvelder." />
        </div>

        <p className="sr-only">
          Uten Notably sitter du igjen med uleselige notater og skriver referatet i kveld. Med Notably er referatet med
          beslutninger og frister ferdig og sendt før du går ut døra.
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-12 grid gap-10 sm:mt-14 md:grid-cols-2 md:gap-8"
        >
          <motion.figure variants={fadeUp()} className="flex flex-col">
            <figcaption className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Uten Notably</figcaption>
            <div className="flex-1">
              <Notebook reduced={reduced} />
            </div>
            <p aria-hidden className="mt-5 text-lg font-semibold text-rose-600">
              Skrives i kveld.
            </p>
          </motion.figure>

          <motion.figure variants={fadeUp(0.15)} className="flex flex-col">
            <figcaption className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Med Notably</figcaption>
            <div className="flex-1">
              <Referat />
            </div>
            <p aria-hidden className="mt-5 text-lg font-semibold text-emerald-600">
              Sendt før du går ut døra.
            </p>
          </motion.figure>
        </motion.div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <PrimaryCta placement="problem">Prøv på neste møte</PrimaryCta>
          <p className="text-sm text-slate-500">14 dager gratis, med full tilgang.</p>
        </div>
      </div>
    </section>
  );
}
