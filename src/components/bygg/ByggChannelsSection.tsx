import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Footprints, Monitor, Smartphone, Upload, Volume2, type LucideIcon } from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

const APP_STORE_URL = 'https://apps.apple.com/no/app/notably/id6783667184?l=nb';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=no.notably.mobile';

interface Channel {
  icon: LucideIcon;
  title: string;
  where: string;
  text: string;
}

/**
 * De fleste byggemøter skjer rundt et bord i brakka eller ute på plassen, og
 * mange på byggeplass har Android. Derfor står mobilappen først. Opptak uten
 * dekning er ikke avklart og nevnes ikke.
 */
const channels: Channel[] = [
  {
    icon: Smartphone,
    title: 'Byggemøtet i brakka',
    where: 'Mobilappen',
    text: 'Legg telefonen midt på bordet og trykk opptak. Ingen PC, ingen kabler, ingen bot på skjermen.',
  },
  {
    icon: Footprints,
    title: 'Befaring og overtakelse',
    where: 'Mobilappen',
    text: 'Ha telefonen med deg mens dere går. Funn, mangler og hvem som utbedrer havner i referatet.',
  },
  {
    icon: Monitor,
    title: 'Prosjektering og endringsmøter',
    where: 'Teams, Zoom og Google Meet',
    text: 'Koble til kalenderen, så blir Notably med i møtene du velger. Også når byggherren kaller inn fra sitt eget verktøy.',
  },
  {
    icon: Upload,
    title: 'Du har allerede et opptak',
    where: 'Last opp lyd',
    text: 'Har du tatt opp møtet med noe annet? Last opp lydfilen og få det samme referatet.',
  },
];

export default function ByggChannelsSection() {
  const reduced = useReducedMotion();
  const card: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <section className="page-container bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Der møtet er</Eyebrow>
          <SectionHeading className="mt-5" lead="I brakka, på befaring eller på Teams." muted="Med telefonen du allerede har." />
        </div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2"
        >
          {channels.map(({ icon: Icon, title, where, text }) => (
            <motion.li
              key={title}
              variants={card}
              className="flex flex-col rounded-[1.75rem] bg-slate-50 p-7 ring-1 ring-inset ring-slate-200/70"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_-16px_rgba(15,23,42,0.4)] ring-1 ring-slate-200/80">
                <Icon className="h-5 w-5 text-blue-600" aria-hidden />
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
              <p className="mt-1 text-sm font-medium text-blue-700">{where}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{text}</p>
            </motion.li>
          ))}
        </motion.ul>

        {/* Støy er det første mange spør om */}
        <div className="mx-auto mt-5 flex max-w-6xl flex-col gap-4 rounded-[1.75rem] border border-slate-200 p-6 sm:flex-row sm:items-start sm:gap-5 sm:p-7">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-200/70">
            <Volume2 className="h-5 w-5 text-amber-700" aria-hidden />
          </span>
          <div>
            <p className="text-[17px] font-semibold tracking-tight text-slate-900">Hva med støyen på plassen?</p>
            <p className="mt-1.5 max-w-3xl text-[15px] leading-relaxed text-slate-600">
              Notably håndterer både byggemøtet i brakka og befaringen ute på plassen. Legg telefonen på bordet, eller
              ha den med deg mens dere går. Referatet får du uansett.
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Mobilappen finnes for iPhone og Android.{' '}
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-700 underline-offset-4 hover:underline"
          >
            App Store
          </a>
          {' · '}
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-700 underline-offset-4 hover:underline"
          >
            Google Play
          </a>
        </p>
      </div>
    </section>
  );
}
