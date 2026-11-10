import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Mic, Send } from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

/** Tre små skjermbilder sier mer enn tre avsnitt. Teksten under hvert steg er én setning. */

const RecordMock = () => (
  <div className="flex h-full flex-col items-center justify-center">
    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">Fjordparken B2</p>
    <p className="mt-0.5 text-[15px] font-semibold text-slate-900">Byggemøte nr. 14</p>
    <span className="relative mt-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center">
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-blue-400/30 motion-reduce:animate-none" />
      <span className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-blue-600 shadow-[0_14px_30px_-12px_rgba(37,99,235,0.8)]">
        <Mic className="h-7 w-7 text-white" aria-hidden />
      </span>
    </span>
    <p className="mt-4 text-sm font-semibold text-blue-700">Trykk for å ta opp</p>
  </div>
);

const NotesMock = () => (
  <div className="space-y-3">
    {[
      { h: 'Framdrift', l: 'Tett bygg blokk B: 8. nov.' },
      { h: 'Fra byggherren', l: 'Hilde Aas: flytt sjakt S3.' },
      { h: 'Frister', l: 'ARK: tegninger innen fre.' },
    ].map(({ h, l }) => (
      <div key={h}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700">{h}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-slate-700">{l}</p>
      </div>
    ))}
  </div>
);

const SendMock = () => (
  <div className="flex h-full flex-col">
    <div className="space-y-1 border-b border-slate-100 pb-2.5 text-[12px]">
      <p className="flex gap-2">
        <span className="w-9 text-slate-500">Til</span>
        <span className="font-medium text-slate-800">11 deltakere</span>
      </p>
      <p className="flex gap-2">
        <span className="w-9 text-slate-500">Emne</span>
        <span className="truncate font-medium text-slate-800">Referat byggemøte nr. 14</span>
      </p>
    </div>
    <div className="mt-3 flex -space-x-2">
      {['bg-slate-800', 'bg-blue-600', 'bg-amber-500', 'bg-emerald-600', 'bg-slate-500'].map((c, i) => (
        <span key={c} className={`h-7 w-7 rounded-full ring-2 ring-white ${c}`} style={{ zIndex: 5 - i }} />
      ))}
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 ring-2 ring-white">
        +6
      </span>
    </div>
    <p className="mt-2 text-[12px] leading-snug text-slate-500">Byggherre, rådgivere og UE-ene får det samme referatet.</p>
    <span className="mt-auto inline-flex items-center justify-center gap-1.5 self-end rounded-full bg-blue-600 px-3.5 py-2 text-[12px] font-semibold text-white">
      <Send className="h-3.5 w-3.5" aria-hidden />
      Send
    </span>
  </div>
);

const steps: { n: string; title: string; text: string; mock: ReactNode }[] = [
  {
    n: '1',
    title: 'Trykk opptak',
    text: 'Med mobilen i brakka eller på befaring. På Teams blir Notably med via kalenderen.',
    mock: <RecordMock />,
  },
  {
    n: '2',
    title: 'Notably skriver referatet',
    text: 'Med navn på hvem som sa hva, og hver oppgave med ansvarlig og frist.',
    mock: <NotesMock />,
  },
  {
    n: '3',
    title: 'Send til alle parter',
    text: 'Les gjennom, rett det du vil og send. De andre trenger ikke Notably.',
    mock: <SendMock />,
  },
];

export default function ByggStepsSection() {
  const reduced = useReducedMotion();
  const card: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <section data-ph-section="features" className="px-6 sm:px-10 md:px-[8%] xl:px-[11%] bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Slik fungerer det</Eyebrow>
          <SectionHeading className="mt-5" lead="Du leder møtet." muted="Notably skriver referatet." />
        </div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-3"
        >
          {steps.map(({ n, title, text, mock }) => (
            <motion.li
              key={n}
              variants={card}
              className="flex flex-col rounded-[1.75rem] bg-white p-5 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.4)] ring-1 ring-inset ring-slate-200/80 sm:p-6"
            >
              <div aria-hidden className="h-[11.5rem] overflow-hidden rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200/70">
                {mock}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {n}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
