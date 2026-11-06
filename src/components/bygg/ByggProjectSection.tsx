import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ClipboardCheck,
  Footprints,
  FolderOpen,
  HardHat,
  KeyRound,
  LayoutTemplate,
  Monitor,
  PencilRuler,
  Smartphone,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

const APP_STORE_URL = 'https://apps.apple.com/no/app/notably/id6783667184?l=nb';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=no.notably.mobile';

interface Meeting {
  icon: LucideIcon;
  name: string;
  date: string;
  via: 'Mobil' | 'Teams';
  sections: string;
}

/**
 * Hele prosjektet i én mappe: møtetypene og hvor de tas opp, vist som en liste
 * i stedet for seks faner. Opptak uten dekning er ikke avklart og nevnes ikke.
 */
const meetings: Meeting[] = [
  { icon: HardHat, name: 'Byggemøte nr. 14', date: '27. okt', via: 'Mobil', sections: 'Framdrift · Beskjeder · Frister' },
  { icon: PencilRuler, name: 'Prosjekteringsmøte', date: '28. okt', via: 'Teams', sections: 'Grensesnitt · Beslutninger' },
  { icon: Footprints, name: 'Befaring, blokk B', date: '30. okt', via: 'Mobil', sections: 'Funn · Hvem utbedrer' },
  { icon: ClipboardCheck, name: 'SHA-møte', date: '3. nov', via: 'Mobil', sections: 'Risiko · Tiltak · Ansvar' },
  { icon: KeyRound, name: 'Overtakelse, leilighet 204', date: '5. nov', via: 'Mobil', sections: 'Mangler · Frister' },
];

const features: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Smartphone, title: 'Mobil i brakka og på plassen', text: 'iPhone og Android. Legg den på bordet, eller ha den med på befaringen.' },
  { icon: Monitor, title: 'Teams, Zoom og Meet', text: 'Koble til kalenderen, så blir Notably med i møtene du velger.' },
  { icon: LayoutTemplate, title: 'Egen mal per møtetype', text: 'Byggemøtet får framdrift og frister. Befaringen får funn og hvem som utbedrer.' },
  { icon: Upload, title: 'Har du et opptak fra før?', text: 'Last opp lydfilen og få det samme referatet.' },
];

export default function ByggProjectSection() {
  const reduced = useReducedMotion();
  const row: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, x: 14 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
  };

  return (
    <section data-ph-section="channels" className="overflow-hidden px-6 sm:px-10 md:px-[8%] xl:px-[11%] bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-x-16 gap-y-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
          <Eyebrow>Fra prosjektering til overtakelse</Eyebrow>
          <SectionHeading className="mt-5" lead="Alle møtene i prosjektet." muted="Samlet i én mappe." />
        </div>

        {/* Prosjektmappen. På mobil rett under overskriften, på desktop til venstre. */}
        <div className="relative lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full bg-amber-200/30 glow scale-[1.9]"
          />
          <div className="relative overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_36px_80px_-48px_rgba(15,23,42,0.5)]">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400">
                <FolderOpen className="h-[18px] w-[18px] text-slate-900" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-semibold tracking-tight text-slate-900">Fjordparken B2</p>
                <p className="text-xs text-slate-500">Prosjektmappe · 23 møter</p>
              </div>
            </div>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              className="divide-y divide-slate-100"
            >
              {meetings.map(({ icon: Icon, name, date, via, sections }) => (
                <motion.li key={name} variants={row} className="flex items-center gap-3.5 px-5 py-3.5 sm:px-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-inset ring-blue-100">
                    <Icon className="h-[18px] w-[18px] text-blue-600" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-slate-900">{name}</p>
                    <p className="truncate text-xs text-slate-500">{sections}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-medium text-slate-500">{date}</p>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                        via === 'Mobil' ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {via === 'Mobil' ? <Smartphone className="h-3 w-3" aria-hidden /> : <Monitor className="h-3 w-3" aria-hidden />}
                      {via}
                    </span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        <div className="lg:col-start-2 lg:row-start-2 lg:self-start">
          <ul className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon className="h-5 w-5 text-blue-600" aria-hidden />
                <h3 className="mt-2.5 text-[17px] font-semibold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-slate-500">
            Last ned appen:{' '}
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 underline-offset-4 hover:underline">
              App Store
            </a>
            {' · '}
            <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 underline-offset-4 hover:underline">
              Google Play
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
