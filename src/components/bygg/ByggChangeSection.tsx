import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { BellRing, FileText, MessageSquareText, type LucideIcon } from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

/**
 * Den muntlige endringen fra heroen, fulgt gjennom tre steg. Advokatene fraråder
 * å bruke byggemøtereferatet som eneste varslingskanal, så siden lover bare at
 * beskjeden blir synlig og får en frist, ikke at Notably sikrer varselet.
 * Se docs/research-bygg-og-anlegg.md.
 */
interface Step {
  icon: LucideIcon;
  label: string;
  title: string;
  detail: string;
  accent: string;
}

const steps: Step[] = [
  {
    icon: MessageSquareText,
    label: 'Sagt på byggemøtet',
    title: '«Sjakten må flyttes 40 cm mot øst.»',
    detail: 'Hilde Aas, byggherren, i en bisetning midt i punktet om framdrift.',
    accent: 'bg-slate-900 text-white',
  },
  {
    icon: FileText,
    label: 'I referatet samme dag',
    title: 'Beskjed fra byggherren: sjakt S3 flyttes',
    detail: 'Med navn på hvem som sa det. Sendt til alle parter, med transkripsjonen bak.',
    accent: 'bg-blue-600 text-white',
  },
  {
    icon: BellRing,
    label: 'Oppgave med frist',
    title: 'Marius: send varsel om endring',
    detail: 'Frist onsdag. Står på oppgavelista med navn, så det ikke blir glemt.',
    accent: 'bg-rose-600 text-white',
  },
];

export default function ByggChangeSection() {
  const reduced = useReducedMotion();
  const step = (i: number): Variants => ({
    hidden: reduced ? { opacity: 0 } : { opacity: 0, x: 16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.55, delay: 0.15 * i, ease } },
  });

  return (
    <section id="endringer" className="page-container scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <Eyebrow>Endringer og tillegg</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="En bisetning kan være en endring."
            muted="Nå ser du den samme dag."
          />
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Standardkontraktene har korte frister for å varsle om endringer, og et varsel som kommer for sent kan
            koste kravet. Problemet er sjelden at du ikke kan reglene. Det er at beskjeden kom muntlig, midt i et
            langt møte, og at referatet ble skrevet tre dager senere.
          </p>

          <div className="mt-8 rounded-3xl bg-slate-50 p-6 ring-1 ring-inset ring-slate-200/80">
            <p className="text-[15px] font-semibold text-slate-900">Du har kontrollen</p>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              Du avgjør hva som er en endring, og sender varselet slik kontrakten krever. Notably sørger for at
              beskjeden står svart på hvitt samme dag, med navn på hvem som sa det, mens det fortsatt er tid.
            </p>
          </div>
        </div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="relative space-y-4"
        >
          <span aria-hidden className="absolute bottom-10 left-[1.65rem] top-10 w-px bg-slate-200 sm:left-[1.9rem]" />
          {steps.map(({ icon: Icon, label, title, detail, accent }, i) => (
            <motion.li
              key={label}
              variants={step(i)}
              className="relative flex gap-4 rounded-[1.75rem] bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] ring-1 ring-inset ring-slate-200/80 sm:gap-5 sm:p-5"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${accent}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-1 text-[17px] font-semibold leading-snug tracking-tight text-slate-900">{title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{detail}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
