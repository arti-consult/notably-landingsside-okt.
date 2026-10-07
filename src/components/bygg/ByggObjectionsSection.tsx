import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

/**
 * Innvendingene folk i bygg og anlegg faktisk har: enda et system, byggherren
 * som skriver referatet selv, samtykke, gutta på plassen og feil i referatet.
 * Støy besvares i kanalseksjonen og i FAQ. Svarene lover ikke mer enn produktet gjør.
 */
const objections: { objection: string; answer: string }[] = [
  {
    objection: 'Vi har Dalux. Vi trenger ikke enda et system.',
    answer:
      'Notably erstatter ikke Dalux eller prosjekthotellet. Den skriver referatet. Du sender det på e-post eller laster det ned, og legger det der det alltid har ligget.',
  },
  {
    objection: 'Byggherren skriver referatet uansett.',
    answer:
      'Da har du ditt eget referat, med navn på hvem som sa hva, å sjekke byggherrens mot. Ser du at en beskjed eller et forbehold mangler, kan du gi merknad før neste møte, mens alle husker hva som ble sagt.',
  },
  {
    objection: 'Må alle i møtet godkjenne opptaket?',
    answer:
      'Alle skal vite at møtet tas opp og hva opptaket brukes til. Skriv det i innkallingen, si det når møtet starter, og la folk si fra. Hos en privatkunde spør du om lov først. Interne møter avklarer du med tillitsvalgte.',
  },
  {
    objection: 'Folka på plassen kommer aldri til å bruke det.',
    answer:
      'De trenger ikke. Den som leder møtet trykker opptak på telefonen, iPhone eller Android. Resten snakker som før, og får referatet på e-post.',
  },
  {
    objection: 'Hva om AI-en hører feil?',
    answer:
      'Du leser gjennom før noe sendes, og retter det du vil. Transkripsjonen ligger der hvis du vil sjekke nøyaktig hva som ble sagt, og av hvem.',
  },
];

export default function ByggObjectionsSection() {
  const reduced = useReducedMotion();
  const fadeUp: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <section id="innvendinger" className="page-container scroll-mt-24 bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Innvendinger</Eyebrow>
            <SectionHeading className="mt-5" lead="Du tenker sikkert noe av dette nå." muted="Her er svarene." />

            <figure className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-inset ring-slate-200/80 sm:p-7">
              <p className="text-5xl font-semibold tracking-tight text-slate-900">1 av 4</p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                beslutningstakere i bygg og anlegg sier at rapporteringskravene er blant de største utfordringene. De
                som har tatt i bruk AI, trekker fram transkripsjon av møter som noe som fungerer.
              </p>
              <figcaption className="mt-4 text-xs text-slate-500">
                Kilde:{' '}
                <a
                  href="https://www.bdo.no/getmedia/6ea831d6-96cd-4436-965d-582029d3064e/BDO-Bygg-og-anleggsanalysen-2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-slate-700 hover:underline"
                >
                  BDO, Bygg- og anleggsanalysen 2025
                </a>{' '}
                (Norstat-undersøkelse)
              </figcaption>
            </figure>
          </div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
            className="space-y-4"
          >
            {objections.map(({ objection, answer }) => (
              <motion.li
                key={objection}
                variants={fadeUp}
                className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)] ring-1 ring-inset ring-slate-200/70 sm:p-7"
              >
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">«{objection}»</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600 sm:text-base">{answer}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
