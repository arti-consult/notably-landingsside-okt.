import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Download, FolderCheck, Mail, Send, UsersRound, type LucideIcon } from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

/**
 * Referatet alle parter får etter heroens byggemøte. Notably har ingen
 * integrasjon med prosjekthotellene, så siden sier bare at referatet lastes
 * ned og legges der det alltid har ligget.
 */
const benefits: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: UsersRound,
    title: 'Alle får samme versjon',
    text: 'Send referatet på e-post til byggherre, rådgivere og underentreprenører rett fra Notably. De trenger ikke Notably selv.',
  },
  {
    icon: FolderCheck,
    title: 'Legg det der det alltid har ligget',
    text: 'Last ned referatet og legg det i prosjekthotellet eller prosjektmappen. Ingen nye rutiner, ingen dobbeltføring.',
  },
  {
    icon: Mail,
    title: 'Du leser gjennom først',
    text: 'Rett det du vil før noe sendes. Du bestemmer hva som deles, og med hvem.',
  },
];

const EmailLine = ({ label, value }: { label: string; value: string }) => (
  <p className="flex gap-3 text-sm">
    <span className="w-12 shrink-0 text-slate-400">{label}</span>
    <span className="min-w-0 truncate font-medium text-slate-800">{value}</span>
  </p>
);

const EmailBlock = ({ heading, lines }: { heading: string; lines: string[] }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">{heading}</p>
    <ul className="mt-1.5 space-y-1">
      {lines.map((line) => (
        <li key={line} className="flex gap-2 text-[15px] leading-relaxed text-slate-700">
          <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-slate-400" />
          {line}
        </li>
      ))}
    </ul>
  </div>
);

export default function ByggShareSection() {
  const reduced = useReducedMotion();
  const fadeUp: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <section className="page-container bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <Eyebrow>Etter møtet</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="Referatet er ute samme dag."
            muted="Mens alle husker møtet."
          />
          <ul className="mt-10 space-y-7">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
                  <Icon className="h-[18px] w-[18px] text-blue-600" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* E-posten partene får */}
        <motion.figure
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="relative"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full bg-blue-300/20 blur-[100px]"
          />
          <div className="relative overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_36px_80px_-48px_rgba(15,23,42,0.45)]">
            <div className="space-y-1.5 border-b border-slate-100 bg-slate-50/70 px-6 py-5 sm:px-8">
              <EmailLine label="Til" value="Deltakerne på byggemøte nr. 14 (11)" />
              <EmailLine label="Emne" value="Referat byggemøte nr. 14 · Fjordparken B2" />
            </div>

            <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-7">
              <EmailBlock
                heading="Beskjeder fra byggherren"
                lines={['Hilde Aas: sjakt S3 flyttes 40 cm mot øst.', 'Marius Berg sender varsel om endring innen onsdag.']}
              />
              <EmailBlock
                heading="Ansvar og frister"
                lines={[
                  'ARK: reviderte tegninger for S3 innen fredag.',
                  'Byggherren: svar på fargevalg for fasaden innen 1. november.',
                ]}
              />
              <EmailBlock heading="Neste byggemøte" lines={['Tirsdag 3. november kl. 09.00 i brakka.']} />
              <p className="border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-500">
                Merknader til referatet sendes senest til neste byggemøte.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4 sm:px-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600">
                <Download className="h-4 w-4" aria-hidden />
                Last ned
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-2 text-sm font-medium text-white">
                <Send className="h-4 w-4" aria-hidden />
                Send til deltakerne
              </span>
            </div>
          </div>
          <figcaption className="sr-only">Eksempel på et byggemøtereferat sendt til alle deltakerne samme dag.</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
