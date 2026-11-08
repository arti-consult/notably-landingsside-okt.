import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { DEMO_URL, Label, PrimaryCta, Reveal } from './shared';

/** Samme anslag som kalkulatoren på bygg-siden: 45 min å skrive, 10 min å lese gjennom. */
const WRITE_MINUTES = 45;
const REVIEW_MINUTES = 10;
const WEEKS_PER_MONTH = 4;

const included = [
  'Referat, beslutninger og oppgaver fra hvert møte',
  'Teams, Zoom, Google Meet og fysiske møter',
  'Outlook og Google Kalender',
  'Spør Notably om alle tidligere møter',
  'Egne maler og mapper',
  'Apper for iPhone og Android',
  'Lagret i EU, aldri brukt til AI-trening',
  'Norsk support',
];

const enterprise = ['SSO', 'Onboarding for hele firmaet', 'Volumpris og tilpasset avtale', 'Hjelp i sikkerhets- og innkjøpsprosessen'];

const nf = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 });

export default function NfPricing() {
  const [meetings, setMeetings] = useState(5);
  const reduced = useReducedMotion();
  const hours = (meetings * (WRITE_MINUTES - REVIEW_MINUTES) * WEEKS_PER_MONTH) / 60;

  return (
    <section
      id="priser"
      data-ph-section="pricing"
      data-hide-sticky-cta
      className="scroll-mt-20 px-5 py-24 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <Label>Pris</Label>
          <h2 className="mt-6 text-balance text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.4rem]">
            399 kroner i måneden.
            <span className="block text-slate-400">Regn ut hva du får tilbake.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Kalkulatoren */}
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-[2rem] bg-blue-600 p-7 text-white sm:p-10">
              <div>
                <label htmlFor="nf-meetings" className="text-lg font-medium text-blue-100">
                  Møter med referat i uka
                </label>
                <div className="mt-6 flex items-center gap-5">
                  <span className="w-14 font-mono text-5xl font-semibold tabular-nums">{meetings}</span>
                  <input
                    id="nf-meetings"
                    type="range"
                    min={1}
                    max={20}
                    value={meetings}
                    onChange={(e) => setMeetings(Number(e.target.value))}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white/25 accent-white"
                  />
                </div>
              </div>
              <div className="mt-12">
                <p className="text-lg text-blue-100">Tid du får tilbake hver måned</p>
                <motion.p
                  key={meetings}
                  initial={reduced ? false : { opacity: 0.4, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-[4.5rem] font-semibold leading-none tracking-[-0.04em] sm:text-[6rem]"
                >
                  {nf.format(hours)} timer
                </motion.p>
                <p className="mt-6 text-sm leading-relaxed text-blue-100/80">
                  Anslag: {WRITE_MINUTES} minutter på å skrive et referat og {REVIEW_MINUTES} minutter på å lese gjennom
                  det Notably har skrevet, {WEEKS_PER_MONTH} uker i måneden.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4">
            <Reveal delay={0.08}>
              <div className="rounded-[2rem] bg-white p-7 ring-1 ring-slate-900/[0.06] sm:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-xl font-semibold text-slate-950">Notably</p>
                  <p className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">14 dager gratis</p>
                </div>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-slate-950">399 kr</span>
                  <span className="text-slate-500">per bruker / mnd eks. mva.</span>
                </p>
                <PrimaryCta placement="pricing" className="mt-7 w-full">
                  Start gratis
                </PrimaryCta>
                <ul className="mt-7 grid gap-2.5 border-t border-slate-200 pt-7 sm:grid-cols-2">
                  {included.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[14.5px] leading-snug text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" strokeWidth={2.5} aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="rounded-[2rem] bg-slate-950 p-7 text-white sm:p-9">
                <p className="text-xl font-semibold">Enterprise</p>
                <p className="mt-1 text-slate-400">For firmaer som ruller ut til mange.</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {enterprise.map((f) => (
                    <li key={f} className="rounded-full bg-white/10 px-3 py-1.5 text-sm">
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  data-demo-cta="pricing_enterprise"
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-blue-50"
                >
                  Snakk med oss
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
