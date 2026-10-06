import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

/**
 * Innvendingene regnskapsførere faktisk har: kundedata, Copilot, kunder som blir
 * usikre av opptak, frykt for KI-feil og sesongpress. Svarene er korte og
 * lover ikke mer enn produktet gjør.
 */
const objections: { objection: string; answer: string }[] = [
  {
    objection: 'Kan jeg bruke dette med kundedata?',
    answer:
      'Ja, på samme vilkår som byråets andre leverandører: databehandleravtale, lagring i EU og ingen bruk av dataene til noe annet. Det er på plass fra første dag.',
  },
  {
    objection: 'Vi har allerede Copilot.',
    answer:
      'Copilot oppsummerer Teams-møter. Mange kundemøter skjer rundt et bord, eller i kundens eget Zoom eller Meet. Notably tar alle, med maler laget for møtene i et regnskapsbyrå.',
  },
  {
    objection: 'Kundene mine blir skeptiske til opptak.',
    answer:
      'Spør først, og si hva opptaket brukes til. Rundt bordet ligger bare telefonen der, uten en bot på skjermen. Og lydfilen kan slettes så snart referatet er klart.',
  },
  {
    objection: 'Hva om KI-en tar feil?',
    answer:
      'Notably gir ikke råd. Den skriver ned rådene du ga. Du leser gjennom før noe sendes, og transkripsjonen ligger der hvis du vil sjekke hva som faktisk ble sagt.',
  },
  {
    objection: 'Vi har ikke tid til noe nytt midt i sesongen.',
    answer:
      'Det er ingenting å rulle ut. Last ned appen eller koble til kalenderen, så er neste møte dokumentert. Det tar noen minutter, og de første 14 dagene er gratis.',
  },
];

export default function RegnskapObjectionsSection() {
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
              <p className="text-5xl font-semibold tracking-tight text-slate-900">51,3 %</p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                sier at frykten for å bli stående ansvarlig for feil KI har gjort, er den største bekymringen.
                Derfor skriver Notably bare ned det du sa.
              </p>
              <figcaption className="mt-4 text-xs text-slate-500">
                Kilde:{' '}
                <a
                  href="https://storage.mfn.se/fec97e8d-0f9d-4629-a7f6-0b72622d9ff3/ki-bruk-i-norsk-administrasjon-og-ledelse.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-slate-700 hover:underline"
                >
                  Sticos, Teknologivaner og KI-modenhet
                </a>{' '}
                {'(1\u00a0410 svar, over halvparten regnskapsførere)'}
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
