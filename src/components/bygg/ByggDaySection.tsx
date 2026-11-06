import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Eyebrow, PrimaryCta, SectionHeading, ease } from '../advokat/shared';

interface Moment {
  time: string;
  text: string;
  highlight?: boolean;
}

/** Samme dag to ganger, tre klokkeslett hver. Forskjellen skal sees, ikke leses. */
const without: Moment[] = [
  { time: '08:00', text: 'Møtet. Du noterer mens du leder.' },
  { time: '21:15', text: 'Du skriver referatet ved kjøkkenbordet.', highlight: true },
  { time: 'Fredag', text: 'Referatet går ut. Ingen husker møtet.' },
];

const withNotably: Moment[] = [
  { time: '08:00', text: 'Møtet. Telefonen ligger på bordet.' },
  { time: '09:05', text: 'Referatet er sendt til alle.', highlight: true },
  { time: '21:15', text: 'Kvelden er din.' },
];

function Timeline({ moments, good }: { moments: Moment[]; good: boolean }) {
  return (
    <ol className="relative mt-7 space-y-6">
      <span
        aria-hidden
        className={`absolute bottom-3 left-[0.4rem] top-3 w-px ${good ? 'bg-blue-200' : 'bg-slate-300'}`}
      />
      {moments.map(({ time, text, highlight }) => (
        <li key={time} className="relative pl-8">
          <span
            aria-hidden
            className={`absolute left-0 top-[0.55rem] h-[0.8rem] w-[0.8rem] rounded-full ring-4 ${
              good
                ? highlight
                  ? 'bg-emerald-500 ring-emerald-100'
                  : 'bg-blue-600 ring-blue-100'
                : highlight
                  ? 'bg-rose-500 ring-rose-100'
                  : 'bg-slate-400 ring-slate-100'
            }`}
          />
          <p
            className={`text-2xl font-semibold tabular-nums tracking-tight ${
              good ? (highlight ? 'text-emerald-700' : 'text-slate-900') : highlight ? 'text-rose-700' : 'text-slate-500'
            }`}
          >
            {time}
          </p>
          <p className={`mt-0.5 text-base leading-relaxed ${good ? 'text-slate-700' : 'text-slate-500'}`}>{text}</p>
        </li>
      ))}
    </ol>
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
          <Eyebrow>En vanlig dag</Eyebrow>
          <SectionHeading className="mt-5" lead="Samme møte." muted="To helt forskjellige kvelder." />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-2"
        >
          <motion.div variants={fadeUp()} className="rounded-[1.75rem] bg-slate-100/80 p-7 ring-1 ring-inset ring-slate-200 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Uten Notably</p>
            <Timeline moments={without} good={false} />
          </motion.div>

          <motion.div
            variants={fadeUp(0.15)}
            className="relative rounded-[1.75rem] bg-white p-7 shadow-[0_30px_70px_-40px_rgba(37,99,235,0.55)] ring-2 ring-blue-600 sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Med Notably</p>
            <Timeline moments={withNotably} good />
          </motion.div>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <PrimaryCta placement="problem">Prøv på neste møte</PrimaryCta>
          <p className="text-sm text-slate-500">14 dager gratis, med full tilgang.</p>
        </div>
      </div>
    </section>
  );
}
