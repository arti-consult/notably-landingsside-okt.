import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Clock3, FileQuestion, PenLine, Repeat2, type LucideIcon } from 'lucide-react';
import { Eyebrow, ease } from './shared';

interface Pain {
  icon: LucideIcon;
  problem: string;
  text: string;
  fix: string;
}

/** Hvert problem har sin løsning rett under – det er det leseren skal sitte igjen med. */
const pains: Pain[] = [
  {
    icon: PenLine,
    problem: 'Du skriver mens klienten snakker',
    text: 'Blikket i notatblokka er blikket som ikke leser klienten. Og det viktigste kommer ofte i en bisetning.',
    fix: 'Du er til stede. Notably skriver.',
  },
  {
    icon: Clock3,
    problem: 'Etterarbeidet havner ikke på timelisten',
    text: 'Renskrive notater, sende referat til klienten, oppdatere saken. Det tar tid – og blir sjelden fakturert.',
    fix: 'Notatet er ferdig når møtet er over.',
  },
  {
    icon: FileQuestion,
    problem: '«Hva sa hun egentlig om datoen?»',
    text: 'Tre måneder senere, eller dagen før hovedforhandling, er et halvferdig notat lite verdt.',
    fix: 'Søk i alt som er sagt – med kilde.',
  },
  {
    icon: Repeat2,
    problem: 'Overleveringen koster',
    text: 'Når fullmektigen tar over eller partneren skal oppdateres, må noen forklare saken på nytt.',
    fix: 'Del notatet. Alle starter fra samme faktum.',
  },
];

export default function AdvokatPainSection() {
  const reduced = useReducedMotion();
  const fadeUp: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <section className="page-container bg-white pb-20 pt-20 sm:pb-24 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="mx-auto max-w-4xl text-center"
        >
          <Eyebrow>Kjenner du deg igjen?</Eyebrow>
          <h2 className="mt-6 text-balance text-[2.35rem] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-800 sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.05]">
            Du er advokat.
            <br />
            <span className="text-slate-500">Ikke referent.</span>
          </h2>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2"
        >
          {pains.map(({ icon: Icon, problem, text, fix }) => (
            <motion.li
              key={problem}
              variants={fadeUp}
              className="flex flex-col rounded-[1.75rem] bg-slate-50 p-7 ring-1 ring-inset ring-slate-200/70 sm:p-8"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200/80">
                <Icon className="h-5 w-5 text-slate-700" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">{problem}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
              <p className="mt-auto flex items-center gap-2 pt-6 text-[15px] font-semibold text-blue-700">
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                {fix}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
