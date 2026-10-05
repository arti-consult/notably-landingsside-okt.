import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FileSearch, Gavel, Handshake, MessagesSquare, UserRound, type LucideIcon } from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from './shared';

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
 * Hver møtetype får sitt eget notat. Innholdet er oppdiktet, men skal se ut
 * som noe en advokat faktisk ville skrevet – med frister, posisjoner og
 * ansvar, ikke generelle «action items».
 */
const meetingTypes: MeetingType[] = [
  {
    id: 'klientmote',
    name: 'Klientmøte',
    icon: UserRound,
    title: 'Inntaksmøte · Olsen mot Byggmester AS',
    meta: 'Fysisk møte · 48 min',
    sections: [
      {
        heading: 'Sakens faktum',
        lines: [
          'Kontrakt om rehabilitering av bad inngått 3. februar, fastpris 412 000 kr.',
          'Fukt oppdaget i juni, entreprenør avviser ansvar skriftlig 2. august.',
        ],
      },
      { heading: 'Klientens mål', lines: ['Retting uten kostnad, subsidiært prisavslag.'] },
      {
        heading: 'Frister og dokumenter',
        lines: ['Reklamasjon sendt 14. juni – sjekk om rettidig.', 'Klienten sender kontrakt, bilder og e-poster.'],
      },
      { heading: 'Neste steg', lines: ['Oppdragsbekreftelse og kundekontroll før fredag.'] },
    ],
  },
  {
    id: 'forhandling',
    name: 'Forhandling',
    icon: Handshake,
    title: 'Forhandlingsmøte · Aksjekjøp Nordvik AS',
    meta: 'Teams · 1 t 32 min',
    sections: [
      {
        heading: 'Partenes posisjoner',
        lines: ['Selger: 84 MNOK, ingen earn-out.', 'Kjøper: 76 MNOK + earn-out på inntil 8 MNOK.'],
      },
      {
        heading: 'Innrømmelser',
        lines: ['Selger aksepterer garantiperiode på 24 mnd.', 'Kjøper frafaller krav om konkurranseklausul utover 2 år.'],
      },
      { heading: 'Uavklart', lines: ['Beløpsgrense for garantikrav (de minimis).'] },
      { heading: 'Neste steg', lines: ['Revidert SPA-utkast til motpart innen 10. oktober.'] },
    ],
  },
  {
    id: 'forberedelse',
    name: 'Forberedelse til retten',
    icon: Gavel,
    title: 'Forberedelse · Partsforklaring',
    meta: 'Fysisk møte · 1 t 45 min',
    sections: [
      {
        heading: 'Klientens forklaring',
        lines: ['Fikk muntlig lovnad om fast stilling i mai.', 'Ble informert om nedbemanning først 2. september.'],
      },
      { heading: 'Svake punkter', lines: ['Lovnaden er ikke bekreftet skriftlig. Ingen vitner til samtalen.'] },
      { heading: 'Spørsmål motparten kan stille', lines: ['Hvorfor ble ikke lovnaden fulgt opp skriftlig?'] },
      { heading: 'Bevis', lines: ['Hent SMS-er fra mai. Vurder kollega som vitne.'] },
    ],
  },
  {
    id: 'saksmote',
    name: 'Internt saksmøte',
    icon: MessagesSquare,
    title: 'Saksgjennomgang · Arbeidsrett',
    meta: 'Teams · 34 min',
    sections: [
      {
        heading: 'Status',
        lines: ['Stevning i Larsen-saken sendt 2. oktober.', 'Tilsvar i Berg-saken under arbeid.'],
      },
      { heading: 'Strategi', lines: ['Vurder å begjære bevisopptak av vitne før hovedforhandling.'] },
      {
        heading: 'Ansvar og frister',
        lines: ['Tora: utkast til tilsvar innen 15. oktober.', 'Marius: kontakter sakkyndig denne uken.'],
      },
    ],
  },
  {
    id: 'due-diligence',
    name: 'Due diligence',
    icon: FileSearch,
    title: 'DD-gjennomgang · Selskapsoppkjøp',
    meta: 'Google Meet · 1 t 10 min',
    sections: [
      {
        heading: 'Funn',
        lines: ['Tre leieavtaler mangler samtykke ved kontrollskifte.', 'Uavklart tvist med tidligere distributør.'],
      },
      { heading: 'Risiko', lines: ['Middels: distributørtvist kan gi krav på ca. 2 MNOK.'] },
      { heading: 'Avklaringer', lines: ['Be selger om korrespondanse med distributøren.'] },
      { heading: 'Ansvar', lines: ['Selskapsrett: leieavtaler. Prosedyre: tvistevurdering.'] },
    ],
  },
];

export default function AdvokatMeetingTypesSection() {
  const [activeId, setActiveId] = useState(meetingTypes[0].id);
  const reduced = useReducedMotion();
  const active = meetingTypes.find((m) => m.id === activeId) ?? meetingTypes[0];

  return (
    <section id="motetyper" className="page-container scroll-mt-24 bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Fra møte til saksnotat</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="Et notat som forstår hva slags møte det var."
            muted="Ikke et generisk referat."
          />
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-slate-600">
            Et inntaksmøte trenger faktum og frister. En forhandling trenger posisjoner og innrømmelser. Velg en
            mal – eller lag firmaets egen – så struktureres notatet slik du ville skrevet det selv.
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
              Eksemplene er oppdiktet. Notatet lages fra det som faktisk blir sagt i ditt møte.
            </p>
          </div>

          {/* Notatet */}
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
                    Notat klart
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
