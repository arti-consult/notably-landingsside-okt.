import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ClipboardCheck, Footprints, HardHat, KeyRound, PencilRuler, Repeat, type LucideIcon } from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

interface NoteSection {
  heading: string;
  lines: string[];
}

interface MeetingType {
  id: string;
  name: string;
  icon: LucideIcon;
  title: string;
  meta: string;
  sections: NoteSection[];
}

/**
 * Hver møtetype får sitt eget referat. Prosjektene er oppdiktet. Fjordparken B2
 * går igjen fra heroen, så byggemøtet, endringen og prosjekteringen henger sammen.
 * Overtakelsen er et forbrukerprosjekt, der bustadoppføringslova § 15 sier at
 * det bør føres protokoll. Referatet er grunnlaget, ikke protokollen selv.
 */
const meetingTypes: MeetingType[] = [
  {
    id: 'byggemote',
    name: 'Byggemøte',
    icon: HardHat,
    title: 'Byggemøte nr. 14 · Fjordparken B2',
    meta: 'Brakka · 11 deltakere · 1 t 10 min',
    sections: [
      {
        heading: 'Framdrift',
        lines: ['Tett bygg for blokk B er forsinket én uke. Ny dato 8. november.', 'Rørlegger er i rute i 3. etasje.'],
      },
      {
        heading: 'Beskjeder fra byggherren',
        lines: [
          'Hilde Aas (byggherren): sjakt S3 flyttes 40 cm mot øst.',
          'Marius Berg mener dette er en endring og sender varsel innen onsdag.',
        ],
      },
      {
        heading: 'Ansvar og frister',
        lines: ['ARK: reviderte tegninger for S3 innen fredag.', 'Rørlegger: bekrefter ny føring når tegningene er klare.'],
      },
      {
        heading: 'Åpent fra forrige møte',
        lines: ['Fargevalg fasade. Byggherren svarer innen 1. november.'],
      },
    ],
  },
  {
    id: 'endring',
    name: 'Endring og tillegg',
    icon: Repeat,
    title: 'Endringsmøte · Fjordparken B2',
    meta: 'Teams · 28 min',
    sections: [
      { heading: 'Hva som endres', lines: ['Balkongrekkverk endres fra glass til spiler på alle 48 leilighetene.'] },
      { heading: 'Hvem ba om det', lines: ['Byggherren, ved prosjektsjef Hilde Aas.'] },
      {
        heading: 'Konsekvens',
        lines: ['Entreprenøren varsler krav om tillegg i pris.', 'Mulig konsekvens for framdriften vurderes.'],
      },
      {
        heading: 'Neste steg',
        lines: ['Pris og konsekvens for framdrift sendes innen 15. november.', 'Byggherren svarer skriftlig.'],
      },
    ],
  },
  {
    id: 'befaring',
    name: 'Befaring',
    icon: Footprints,
    title: 'Befaring · Kroken barnehage',
    meta: 'Mobil på stedet · 41 min',
    sections: [
      {
        heading: 'Funn',
        lines: ['Fukt i bunnsvill langs nordveggen, avdeling 2.', 'Mangler branntetting ved gjennomføring i teknisk rom.'],
      },
      {
        heading: 'Hvem utbedrer',
        lines: ['Tømrer åpner veggen og måler fukt innen tirsdag.', 'Elektriker tetter gjennomføringen før tetthetsmålingen.'],
      },
      { heading: 'Avklaring', lines: ['Byggherren vil se fuktmålingene før veggen lukkes.'] },
      { heading: 'Neste befaring', lines: ['Torsdag 12. november kl. 08.00.'] },
    ],
  },
  {
    id: 'overtakelse',
    name: 'Overtakelse',
    icon: KeyRound,
    title: 'Overtakelse · Solsiden rekkehus, hus 4',
    meta: 'Mobil på stedet · 55 min',
    sections: [
      { heading: 'Mangler', lines: ['Riper i parketten i stua.', 'Døra til boden går tregt.'] },
      { heading: 'Frister', lines: ['Manglene utbedres innen seks uker.'] },
      { heading: 'Avtalt', lines: ['Kjøper overtar boligen i dag.', 'Fire nøkler overlevert.'] },
      { heading: 'Til protokollen', lines: ['Begge parter går gjennom punktene før protokollen signeres.'] },
    ],
  },
  {
    id: 'prosjektering',
    name: 'Prosjektering',
    icon: PencilRuler,
    title: 'Prosjekteringsmøte · Fjordparken B2',
    meta: 'Teams · 46 min',
    sections: [
      { heading: 'Grensesnitt', lines: ['RIV og RIE avklarer føringer i himlingen i korridoren i 2. etasje.'] },
      { heading: 'Beslutninger', lines: ['Hulldekkene beholdes. RIB sjekker utsparingene.'] },
      { heading: 'Frister', lines: ['Kollisjonskontroll i modellen før neste møte 12. november.'] },
      { heading: 'Til byggherren', lines: ['Kan tekniske rom flyttes til kjelleren?'] },
    ],
  },
  {
    id: 'sha',
    name: 'SHA og HMS',
    icon: ClipboardCheck,
    title: 'SHA-møte · Fjordparken B2',
    meta: 'Brakka · 34 min',
    sections: [
      { heading: 'Risiko', lines: ['Arbeid i høyden når fasadeelementene monteres i uke 46.'] },
      {
        heading: 'Tiltak',
        lines: ['Stillaset kontrolleres og merkes før bruk.', 'Kranfører og stroppere får eget oppstartsmøte mandag.'],
      },
      { heading: 'SHA-planen', lines: ['Koordinator oppdaterer planen med de nye tiltakene innen fredag.'] },
      { heading: 'Ansvar', lines: ['Anleggsleder følger opp stillaskontrollen.'] },
    ],
  },
];

export default function ByggMeetingTypesSection() {
  const [activeId, setActiveId] = useState(meetingTypes[0].id);
  const reduced = useReducedMotion();
  const active = meetingTypes.find((m) => m.id === activeId) ?? meetingTypes[0];

  return (
    <section id="motetyper" className="page-container scroll-mt-24 bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Fra møtet til referatet</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="Fra byggemøtet til overtakelsen."
            muted="Hvert møte får sitt eget referat."
          />
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-slate-600">
            Byggemøtet trenger framdrift og åpne punkter. Befaringen trenger funn og hvem som utbedrer. Velg en
            mal, eller lag deres egen, så får referatet det oppsettet dere bruker i dag.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[17rem_1fr] lg:gap-8">
          {/* Møtetypene. Vannrett rulling på mobil, liste på desktop. */}
          <div
            role="tablist"
            aria-label="Møtetyper"
            className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {meetingTypes.map(({ id, name, icon: Icon }) => {
              const selected = id === activeId;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${id}`}
                  onClick={() => setActiveId(id)}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 lg:py-3.5 ${
                    selected
                      ? 'bg-white text-slate-900 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] ring-1 ring-slate-200'
                      : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      selected ? 'bg-blue-600 text-white' : 'bg-slate-200/70 text-slate-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {name}
                </button>
              );
            })}
            <p className="hidden px-4 pt-4 text-sm leading-relaxed text-slate-500 lg:block">
              Prosjektene er oppdiktet. Referatet lages fra det som faktisk blir sagt i ditt møte.
            </p>
          </div>

          {/* Referatet */}
          <div className="relative min-h-[27rem] overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_36px_80px_-48px_rgba(15,23,42,0.45)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                role="tabpanel"
                id={`panel-${active.id}`}
                aria-labelledby={`tab-${active.id}`}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
                className="p-6 sm:p-9"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{active.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{active.meta}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Referat klart
                  </span>
                </div>

                <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                  {active.sections.map((section, i) => (
                    <motion.div
                      key={section.heading}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 * i + 0.1, ease }}
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                        {section.heading}
                      </dt>
                      <dd className="mt-2 space-y-1.5">
                        {section.lines.map((text) => (
                          <p key={text} className="text-[15px] leading-relaxed text-slate-700">
                            {text}
                          </p>
                        ))}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
