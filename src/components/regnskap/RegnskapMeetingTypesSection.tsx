import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookCheck, Handshake, Lightbulb, UsersRound, LayoutList, type LucideIcon } from 'lucide-react';
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
 * Hver møtetype får sitt eget referat. Kundene er oppdiktet, men fristene er
 * ekte: skattemelding for AS 31. mai, årsregnskap til Regnskapsregisteret
 * 31. juli, a-melding den 5. og mva for 5. termin 10. desember.
 */
const meetingTypes: MeetingType[] = [
  {
    id: 'oppstart',
    name: 'Oppstartsmøte',
    icon: Handshake,
    title: 'Oppstartsmøte · Fjordlys Kafé AS',
    meta: 'Fysisk møte · 52 min',
    sections: [
      {
        heading: 'Om kunden',
        lines: ['Kafé i Bergen sentrum, seks ansatte, omsetning ca. 7 MNOK.', 'Reell rettighetshaver: Lina Strand, 100 % via Strand Holding AS.'],
      },
      {
        heading: 'Oppdraget',
        lines: ['Løpende bokføring, lønn, mva og årsoppgjør.', 'Overtar fra forrige regnskapsfører per 1. januar.'],
      },
      { heading: 'Kunden sender', lines: ['Firmaattest, aksjonærbok og legitimasjon for daglig leder.'] },
      {
        heading: 'Neste steg',
        lines: ['Oppdragsavtale og fullmakter til signering innen torsdag.', 'Be om uttalelse fra forrige regnskapsfører.'],
      },
    ],
  },
  {
    id: 'arsoppgjor',
    name: 'Årsoppgjør',
    icon: BookCheck,
    title: 'Årsoppgjørsmøte · Nordvik Elektro AS',
    meta: 'Teams · 38 min',
    sections: [
      {
        heading: 'Avklaringer',
        lines: ['Varebil kjøpt i mars, faktura mangler i regnskapet.', 'Kunden mener fordringen på 84 000 kr er tapt.'],
      },
      {
        heading: 'Råd gitt',
        lines: ['Utbytte framfor høyere lønn, så lenge likviditeten holder. Vurderes på nytt i desember.'],
      },
      { heading: 'Kunden sender', lines: ['Faktura for varebilen og purringer på fordringen innen 15. februar.'] },
      { heading: 'Frister', lines: ['Skattemelding for selskapet: 31. mai.', 'Årsregnskap til Regnskapsregisteret: 31. juli.'] },
    ],
  },
  {
    id: 'radgivning',
    name: 'Rådgivning',
    icon: Lightbulb,
    title: 'Rådgivningsmøte · Holdingselskap',
    meta: 'Fysisk møte · 1 t 5 min',
    sections: [
      { heading: 'Kundens spørsmål', lines: ['Bør Erik eie driftsselskapet gjennom et holdingselskap?'] },
      {
        heading: 'Råd gitt',
        lines: [
          'Holdingselskap gir mer fleksibilitet ved utbytte og et eventuelt salg.',
          'Gir også et ekstra årsregnskap og høyere løpende kostnader.',
        ],
      },
      { heading: 'Forutsetninger', lines: ['Bygger på dagens regler, og at overskuddet skal investeres videre.'] },
      { heading: 'Kundens valg', lines: ['Erik tenker over det og gir svar innen 1. november.'] },
    ],
  },
  {
    id: 'lonn',
    name: 'Lønn og ansatte',
    icon: UsersRound,
    title: 'Lønnsavklaring · Haug Bygg AS',
    meta: 'Teams · 18 min',
    sections: [
      {
        heading: 'Endringer',
        lines: ['To nye tømrere fra 1. november, fast stilling 100 %.', 'Jonas får firmabil fra desember.'],
      },
      { heading: 'Kunden sender', lines: ['Arbeidskontrakter og kontonummer innen 25. oktober.'] },
      { heading: 'Frister', lines: ['Med i a-meldingen for november, frist 5. desember.'] },
      { heading: 'Oppfølging', lines: ['Forklar Jonas hvordan fordelen ved firmabil skattlegges.'] },
    ],
  },
  {
    id: 'portefolje',
    name: 'Internt byråmøte',
    icon: LayoutList,
    title: 'Porteføljemøte · Team Vest',
    meta: 'Teams · 31 min',
    sections: [
      {
        heading: 'Status',
        lines: ['Mva for 5. termin: 18 av 31 kunder klare.', 'Tre kunder mangler bilag for oktober.'],
      },
      { heading: 'Kapasitet', lines: ['Kari tar over Nordvik Elektro mens Ola har permisjon.'] },
      {
        heading: 'Ansvar og frister',
        lines: ['Ola purrer bilag i dag.', 'Alle mva-meldinger for 5. termin sendt innen 10. desember.'],
      },
    ],
  },
];

export default function RegnskapMeetingTypesSection() {
  const [activeId, setActiveId] = useState(meetingTypes[0].id);
  const reduced = useReducedMotion();
  const active = meetingTypes.find((m) => m.id === activeId) ?? meetingTypes[0];

  return (
    <section id="motetyper" className="page-container scroll-mt-24 bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Fra kundemøte til referat</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="Et oppstartsmøte er ikke et årsoppgjør."
            muted="Referatet vet forskjellen."
          />
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-slate-600">
            Et oppstartsmøte trenger eierskap og fullmakter. Et rådgivningsmøte trenger rådet og forutsetningene.
            Velg en mal, eller lag byråets egen, så får referatet den strukturen du ville brukt selv.
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
              Kundene er oppdiktet. Referatet lages fra det som faktisk blir sagt i ditt møte.
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
