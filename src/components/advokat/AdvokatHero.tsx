import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Check, Scale } from 'lucide-react';
import HeroMeetingVisual, { type MeetingItem, type MeetingSpeaker } from '../HeroMeetingVisual';
import { PrimaryCta, SecondaryCta, ease } from './shared';

/**
 * Et vanlig inntaksmøte i en oppsigelsessak: klienten gir faktum, advokaten
 * ser fristen, fullmektigen tar oppdragsbekreftelsen. Fristen er regnet ut
 * (12. mars + 8 uker = 7. mai, jf. arbeidsmiljøloven § 17-4), så den tåler at
 * en advokat sjekker den.
 */
const speakers: MeetingSpeaker[] = [
  { initials: 'ML', color: 'bg-slate-800' },
  { initials: 'KH', color: 'bg-emerald-600' },
  { initials: 'TS', color: 'bg-blue-600' },
];

const items: MeetingItem[] = [
  {
    speaker: 1,
    said: 'Oppsigelsen kom på e-post 12. mars.',
    tag: 'Faktum',
    tagClass: 'bg-indigo-50 text-indigo-700 ring-indigo-200/70',
    text: 'Oppsigelse mottatt 12. mars',
  },
  {
    speaker: 0,
    said: 'Da har vi åtte uker på søksmålet.',
    tag: 'Frist',
    tagClass: 'bg-rose-50 text-rose-700 ring-rose-200/70',
    text: 'Søksmålsfrist · aml. § 17-4',
    due: '7. mai',
  },
  {
    speaker: 2,
    said: 'Jeg sender oppdragsbekreftelsen i dag.',
    tag: 'Oppgave',
    tagClass: 'bg-amber-50 text-amber-700 ring-amber-200/70',
    text: 'Tora · oppdragsbekreftelse',
    due: 'I dag',
  },
];

const proofPoints = ['Lagret i EU', 'Aldri brukt til AI-trening', '14 dager gratis'];

export default function AdvokatHero() {
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
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10 sm:pt-36 md:px-[12%] lg:pb-24 xl:pl-[19%] xl:pr-[12%]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-48 h-[24rem] w-[24rem] rounded-full bg-sky-300/20 glow scale-[1.86] lg:-top-40 lg:right-[-10%] lg:h-[38rem] lg:w-[38rem] lg:bg-blue-400/20 lg:scale-[1.64]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-[55%] h-[20rem] w-[20rem] rounded-full bg-indigo-300/15 glow scale-[2.03] lg:-left-[12%] lg:top-16 lg:h-[26rem] lg:w-[26rem] lg:bg-indigo-400/15 lg:scale-[1.87]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.p
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 py-1.5 pl-1.5 pr-3.5 text-sm font-medium text-slate-700 backdrop-blur"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900">
                <Scale className="h-3.5 w-3.5 text-white" aria-hidden />
              </span>
              For advokater og advokatfirmaer
            </motion.p>

            <motion.h1
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              className="mt-7 text-[2.25rem] font-semibold leading-[1.12] tracking-[-0.025em] text-slate-800 sm:text-[3.1rem] lg:text-[2.6rem] lg:leading-[1.06] xl:text-[3.1rem] 2xl:text-[3.6rem]"
            >
              <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                <motion.span variants={line} className="block text-slate-800">
                  Lytt til klienten.
                </motion.span>
              </span>{' '}
              <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                <motion.span
                  variants={line}
                  className="block bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-[CanvasText]"
                >
                  Notably tar notatet.
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-7 max-w-lg text-lg leading-relaxed text-slate-500 sm:text-xl"
            >
              Notably dokumenterer klientmøter, forhandlinger og saksmøter – med faktum, frister og neste steg
              ferdig strukturert når møtet er over. Så du kan bruke tiden på saken, ikke på referatet.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryCta placement="hero">Prøv gratis i 14 dager</PrimaryCta>
              <SecondaryCta>Book demo for firmaet</SecondaryCta>
            </motion.div>

            <motion.ul variants={item} className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {proofPoints.map((point) => (
                <li key={point} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} aria-hidden />
                  {point}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <div className="relative flex justify-center lg:justify-end">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 m-auto h-[24rem] w-[24rem] rounded-full bg-blue-300/15 glow scale-[1.78] lg:bg-blue-400/20"
            />
            <motion.div
              className="relative w-full max-w-[26rem] lg:max-w-[27rem]"
              initial={reduced ? undefined : { opacity: 0, y: 34 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            >
              <HeroMeetingVisual title="Klientmøte · Oppsigelse" speakers={speakers} items={items} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
