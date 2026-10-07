import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, ListTodo, MessageSquareQuote, MoonStar, PhoneIncoming, type LucideIcon } from 'lucide-react';
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
    problem: '«Det har vi aldri avtalt»',
    text: 'Et halvt år senere husker byggherren møtet på sin måte. Står det ikke skriftlig, er det ord mot ord, og tilleggsarbeidet blir vanskelig å få betalt.',
    fix: 'Hva som ble sagt, og av hvem, står i referatet.',
  },
  {
    icon: PhoneIncoming,
    problem: 'Endringen kom muntlig',
    text: 'En beskjed i en bisetning kan være en endring du må varsle om. Fristene i standardkontraktene er korte, og et varsel som kommer for sent kan koste kravet.',
    fix: 'Den blir en oppgave med frist.',
  },
  {
    icon: MoonStar,
    problem: 'Referatet skrives på kvelden',
    text: 'Etter en dag på plassen skal byggemøtet renskrives og sendes ut. Kommer det sent, rekker ingen å gi merknader før neste møte.',
    fix: 'Referatet er klart når møtet er over.',
  },
  {
    icon: ListTodo,
    problem: 'Åpne punkter drukner',
    text: 'Tolv deltakere, fem fag og tjue punkter. Det som ikke har en ansvarlig og en dato, blir liggende til det blir et problem.',
    fix: 'Hvert punkt får navn og frist.',
  },
];

export default function ByggPainSection() {
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
            Tegningene ligger i Dalux.
            <br />
            <span className="text-slate-500">Det byggherren sa, ligger ingen steder.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-slate-600">
            Kontrakten, modellen og avvikene er digitale. Men det som blir avtalt rundt bordet i brakka, havner
            fortsatt i en notatblokk, i hodet til den som var der, eller i et referat som skrives tre dager senere.
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

        {/* Tallet som viser at tvistene ikke er teoretiske */}
        <motion.figure
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="mt-5 flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-7 sm:flex-row sm:items-center sm:gap-10 sm:p-8"
        >
          <p className="shrink-0 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">2,2 mrd. kr</p>
          <div>
            <p className="text-[15px] leading-relaxed text-slate-700 sm:text-base">
              i året koster byggetvister i anleggsbransjen, ifølge en beregning gjort for EBA. Bransjeforeningene
              ber om referater fra byggemøtene som er «riktig og balansert», og svarplikt på uavklarte punkter.
            </p>
            <figcaption className="mt-2 text-xs text-slate-500">
              Kilde:{' '}
              <a
                href="https://www.eba.no/siteassets/dokumenter/veiledere-og-maler/konflikt-i-prosjekt-29.05.19.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-slate-700 hover:underline"
              >
                EBA og bransjeforeningene, «Konflikt i prosjekt» (2019)
              </a>
            </figcaption>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
