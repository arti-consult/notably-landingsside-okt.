import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Monitor, Smartphone, Upload, type LucideIcon } from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

const APP_STORE_URL = 'https://apps.apple.com/no/app/notably/id6783667184?l=nb';

interface Channel {
  icon: LucideIcon;
  title: string;
  where: string;
  text: string;
}

/**
 * Mange kundemøter skjer rundt et bord, og kunder kan bli usikre når en
 * AI-deltaker dukker opp på skjermen. Derfor står mobilappen først.
 */
const channels: Channel[] = [
  {
    icon: Smartphone,
    title: 'Kunden sitter rundt bordet',
    where: 'Mobilappen',
    text: 'Legg telefonen på bordet og trykk opptak. Ingen bot og ingen skjerm mellom deg og kunden, bare samtalen.',
  },
  {
    icon: Monitor,
    title: 'Møtet er digitalt',
    where: 'Teams, Zoom og Google Meet',
    text: 'Koble til kalenderen, så blir Notably med i møtene du velger. Også når kunden kaller inn fra sitt eget verktøy.',
  },
  {
    icon: Upload,
    title: 'Du har allerede et opptak',
    where: 'Last opp lyd',
    text: 'Har du et opptak fra før? Last opp lydfilen og få det samme strukturerte referatet.',
  },
];

export default function RegnskapChannelsSection() {
  const reduced = useReducedMotion();
  const card: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <section className="page-container bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Der kunden er</Eyebrow>
          <SectionHeading className="mt-5" lead="På kontoret, på Teams eller hos kunden." muted="Referatet blir like godt." />
        </div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-3"
        >
          {channels.map(({ icon: Icon, title, where, text }) => (
            <motion.li
              key={title}
              variants={card}
              className="flex flex-col rounded-[1.75rem] bg-white p-7 ring-1 ring-inset ring-slate-200/70"
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

        <p className="mt-8 text-center text-sm text-slate-500">
          Mobilappen finnes for iPhone.{' '}
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-700 underline-offset-4 hover:underline"
          >
            Last ned fra App Store
          </a>
        </p>
      </div>
    </section>
  );
}
