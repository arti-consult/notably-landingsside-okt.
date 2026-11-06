import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BellRing, FileSearch, Search, UserRound, Sparkles, type LucideIcon } from 'lucide-react';
import { Eyebrow, PrimaryCta, SectionHeading, ease } from '../advokat/shared';

/**
 * Det som gjør vondt i bygg: muntlige beskjeder som blir ord mot ord. Vist som
 * et søk i prosjektmappen et halvt år senere. Advokatene fraråder å bruke
 * byggemøtereferatet som eneste varslingskanal, så siden lover bare at
 * beskjeden står skriftlig og får en frist, ikke at Notably sikrer varselet.
 * Se docs/research-bygg-og-anlegg.md.
 */
const examples = [
  {
    chip: 'Sjakt S3',
    question: 'Når ba byggherren om å flytte sjakt S3?',
    answer:
      'På byggemøte nr. 14. Hilde Aas fra byggherren ba om at sjakten flyttes 40 cm mot øst. Marius skulle sende varsel om endring innen onsdag.',
    line: 'Hilde Aas (byggherren): sjakt S3 flyttes 40 cm mot øst.',
    heading: 'Beskjeder fra byggherren',
    source: 'Byggemøte nr. 14 · 27. oktober',
  },
  {
    chip: 'Rekkverk',
    question: 'Hva ble avtalt om balkongrekkverket?',
    answer:
      'Byggherren endret fra glass til spiler på alle 48 leilighetene. Entreprenøren varslet krav om tillegg, og pris skal sendes innen 15. november.',
    line: 'Byggherren endrer rekkverk fra glass til spiler. Krav om tillegg varslet.',
    heading: 'Hva som endres',
    source: 'Endringsmøte · 29. oktober',
  },
  {
    chip: 'Befaring',
    question: 'Hva er fortsatt åpent fra befaringen på Kroken?',
    answer:
      'Fukt i bunnsvill langs nordveggen og manglende branntetting i teknisk rom. Byggherren vil se fuktmålingene før veggen lukkes.',
    line: 'Byggherren vil se fuktmålingene før veggen lukkes.',
    heading: 'Avklaring',
    source: 'Befaring · Kroken barnehage · 5. november',
  },
];

const points: { icon: LucideIcon; text: string }[] = [
  { icon: UserRound, text: 'Hver beskjed står med navn på hvem som sa den, og når.' },
  { icon: BellRing, text: 'En muntlig endring blir en oppgave med frist samme dag, mens det er tid til å varsle.' },
  { icon: FileSearch, text: 'Spør på tvers av alle møtene i prosjektet, også dem en kollega satt i.' },
];

export default function ByggProofSection() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const ex = examples[active];

  return (
    <section id="endringer" className="overflow-hidden px-6 sm:px-10 md:px-[8%] xl:px-[11%] scroll-mt-24 bg-slate-950 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <Eyebrow className="text-amber-300">Et halvt år senere</Eyebrow>
          <SectionHeading className="mt-5" dark lead="«Det har vi aldri avtalt.»" muted="Jo. På byggemøte nr. 14." />

          <ul className="mt-9 space-y-5">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
                  <Icon className="h-[18px] w-[18px] text-amber-300" aria-hidden />
                </span>
                <p className="pt-2 text-[16px] leading-relaxed text-slate-300">{text}</p>
              </li>
            ))}
          </ul>

          <PrimaryCta light placement="changes" className="mt-10">
            Prøv gratis
          </PrimaryCta>
        </div>

        {/* Søket i prosjektmappen */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full bg-blue-500/25 glow scale-[1.9]"
          />
          <div className="relative overflow-hidden rounded-[26px] bg-white shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5 sm:px-6">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="ml-2 text-xs font-medium text-slate-500">Fjordparken B2 · 23 møter</span>
            </div>

            <div className="p-5 sm:p-7">
              <div role="tablist" aria-label="Eksempelspørsmål" className="flex flex-wrap gap-2">
                {examples.map(({ chip }, i) => (
                  <button
                    key={chip}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => setActive(i)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      i === active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3.5 ring-1 ring-inset ring-slate-200">
                <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <p className="text-[15px] font-medium text-slate-900">{ex.question}</p>
              </div>

              <div className="relative mt-4 min-h-[15.5rem] sm:min-h-[13.5rem]" role="tabpanel" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                      Svar
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-700 sm:text-base">{ex.answer}</p>

                    <div className="mt-4 rounded-2xl border-l-4 border-amber-400 bg-amber-50/70 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                        Fra referatet · {ex.heading}
                      </p>
                      <p className="mt-1 text-[15px] font-medium leading-snug text-slate-900">{ex.line}</p>
                    </div>

                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      <FileSearch className="h-3.5 w-3.5" aria-hidden />
                      Kilde: {ex.source}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          <p className="relative mt-4 text-center text-xs text-slate-500">Prosjektene er oppdiktet.</p>
        </div>
      </div>
    </section>
  );
}
