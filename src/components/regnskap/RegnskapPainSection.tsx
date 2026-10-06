import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Clock3, MessageSquareQuote, PhoneIncoming, UserRoundCog, type LucideIcon } from 'lucide-react';
import { Eyebrow, ease } from '../advokat/shared';

interface Pain {
  icon: LucideIcon;
  problem: string;
  text: string;
  fix: string;
}

/** Hvert problem har sin løsning rett under. Rekkefølgen følger det som koster mest. */
const pains: Pain[] = [
  {
    icon: MessageSquareQuote,
    problem: '«Det var ikke det du sa»',
    text: 'Et år senere husker kunden rådet på sin måte. Uten notat står ord mot ord, og det er du som har ansvaret.',
    fix: 'Rådet og forutsetningene står i referatet.',
  },
  {
    icon: PhoneIncoming,
    problem: 'Det viktigste kommer muntlig',
    text: 'En ny varebil, to nye ansatte, et lån i holdingselskapet. Det dukker opp i en bisetning, og må inn i regnskapet eller lønna.',
    fix: 'Det blir en oppgave med frist.',
  },
  {
    icon: Clock3,
    problem: 'Oppsummeringen spiser fastprisen',
    text: 'Referat, e-post til kunden og notat i kundemappen. Etter hvert møte, og sjelden noe du får betalt for.',
    fix: 'Referatet er klart når møtet er over.',
  },
  {
    icon: UserRoundCog,
    problem: 'Kundehistorikken sitter i ett hode',
    text: 'Når kundeansvarlig bytter, er syk eller slutter midt i årsoppgjøret, må kunden forklare alt på nytt.',
    fix: 'Alle møter med kunden er søkbare.',
  },
];

export default function RegnskapPainSection() {
  const reduced = useReducedMotion();
  const fadeUp: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <section className="page-container bg-white pb-20 pt-16 sm:pb-24 sm:pt-24">
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
            Alt ligger i systemet.
            <br />
            <span className="text-slate-500">Bortsett fra det kunden sa.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-slate-600">
            Bilagene er digitale og bankavstemmingen går nesten av seg selv. Men rådene du gir og beskjedene
            kunden gir deg i møtet, havner fortsatt i en notatblokk. Eller ingen steder.
          </p>
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

        {/* Tallet som viser at ansvaret ikke er teoretisk */}
        <motion.figure
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="mt-5 flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-7 sm:flex-row sm:items-center sm:gap-10 sm:p-8"
        >
          <p className="shrink-0 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Flere hundre
          </p>
          <div>
            <p className="text-[15px] leading-relaxed text-slate-700 sm:text-base">
              saker er meldt til ansvarsforsikringen fra medlemmer av Regnskap Norge siden 2021. Uriktig
              rådgivning om mva er en av de typiske årsakene.
            </p>
            <figcaption className="mt-2 text-xs text-slate-500">
              Kilde:{' '}
              <a
                href="https://www.regnskapnorge.no/magasin/ta-grep-sa-du-ikke-sitter-i-saksa/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-slate-700 hover:underline"
              >
                Regnskap Norge, «Ta grep så du ikke sitter i saksa» (2024)
              </a>
            </figcaption>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
