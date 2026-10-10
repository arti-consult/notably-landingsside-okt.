import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { AudioLines, Ban, Building2, Check, FileCheck2, KeyRound, Lock, Mic, type LucideIcon } from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from '../advokat/shared';

/**
 * Påstandene her skal stemme med personvernerklæringen (src/pages/PrivacyPolicy.tsx)
 * og advokatsiden. Ikke legg til sertifiseringer eller garantier vi ikke har.
 *
 * Sjekklisten følger Finanstilsynets krav til regnskapsforetak: IKT-risikovurderingen
 * skal dekke taushetsplikt og personvern, og leverandøravtaler skal være skriftlige
 * og kunne avsluttes kontrollert. Innsyn og kontroll er ikke avklart, så det
 * punktet er utelatt.
 */
const FINANSTILSYNET_URL =
  'https://www.finanstilsynet.no/tillatelser/regnskapsselskap/hvilke-krav-gjelder-etter-at-regnskapsforetaket-har-fatt-godkjenning/';

const checklist: { question: string; answer: string }[] = [
  {
    question: 'Hvor havner opplysningene?',
    answer: 'Opptak, transkripsjoner og referater lagres på Notablys egen drift i EU. Tale og AI behandles også i EU.',
  },
  {
    question: 'Er avtalen med leverandøren skriftlig?',
    answer: 'Databehandleravtalen er på plass når dere blir kunde. Alle underleverandører er bundet av databehandleravtaler.',
  },
  {
    question: 'Hvordan ivaretas taushetsplikten?',
    answer: 'Byråets møter er skilt fra alle andre kunder, og bare de dere gir tilgang kan se dem.',
  },
  {
    question: 'Kan avtalen avsluttes på en kontrollert måte?',
    answer: 'Eksporter referatene når som helst, og slett enkeltmøter eller hele arbeidsområdet.',
  },
];

const extras: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Ban,
    title: 'Aldri brukt til AI-trening',
    text: 'Kundemøtene brukes til å lage dine referater. Ikke til å trene modeller, verken våre eller andres.',
  },
  {
    icon: AudioLines,
    title: 'Slett lyden, behold referatet',
    text: 'Fjern lydfilen når referatet er klart. Da lagrer du ikke mer av samtalen enn du trenger.',
  },
  {
    icon: KeyRound,
    title: 'Tilgang som resten av IT-en',
    text: 'Byråer kan få SSO, så tilgang til Notably styres sammen med resten av systemene.',
  },
];

const node =
  'flex w-full max-w-[15rem] flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4 text-center sm:max-w-none sm:px-5 sm:py-5';

export default function RegnskapSecuritySection() {
  const reduced = useReducedMotion();

  const step = (delay: number): Variants => ({
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease } },
  });

  const Connector = ({ label, delay }: { label: string; delay: number }) => (
    <motion.div
      variants={step(delay)}
      className="relative flex h-16 w-full items-center justify-center sm:h-auto sm:w-auto"
    >
      <div className="relative h-full w-px bg-white/15 sm:h-px sm:w-full">
        <span className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-900">
          <Lock className="h-3.5 w-3.5 text-blue-300" aria-hidden />
        </span>
      </div>
      <span className="absolute left-1/2 top-1/2 ml-6 -translate-y-1/2 whitespace-nowrap text-xs font-medium text-slate-400 sm:top-5 sm:ml-0 sm:-translate-x-1/2 sm:translate-y-0">
        {label}
      </span>
    </motion.div>
  );

  return (
    <section id="sikkerhet" className="relative scroll-mt-24 bg-white py-16 sm:py-20 md:px-[6%] xl:px-[10%]">
      <div className="relative overflow-hidden bg-slate-950 px-6 py-16 sm:rounded-[2.5rem] sm:px-10 sm:py-20 lg:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 glow scale-[1.8]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[24rem] w-[24rem] rounded-full bg-indigo-500/15 glow scale-[1.94]"
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-blue-300">Taushetsplikt og personvern</Eyebrow>
            <SectionHeading
              dark
              className="mt-5"
              lead="Kundens tall er taushetsbelagt."
              muted="Det gjelder også verktøyene dine."
            />
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-slate-300">
              Regnskapsførerloven § 4-2 krever at byrået hindrer uvedkommende i å få tilgang til opplysninger om
              kundene. Det gjelder også det som blir sagt i kundemøtet. Før du tar det opp, må du vite hvor det
              havner og hva det brukes til.
            </p>
          </div>

          {/* Dataflyten */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-12 flex flex-col items-center sm:grid sm:grid-cols-[1fr_minmax(4rem,0.7fr)_1fr_minmax(4rem,0.7fr)_1fr] sm:items-center"
          >
            <motion.div variants={step(0)} className={node}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Mic className="h-[18px] w-[18px] text-slate-900" aria-hidden />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-white">Kundemøtet</span>
                <span className="mt-0.5 block text-xs text-slate-400 sm:text-[13px]">På mobil eller digitalt</span>
              </span>
            </motion.div>

            <Connector label="Kryptert (TLS)" delay={0.2} />

            <motion.div variants={step(0.4)} className={`${node} ring-1 ring-blue-400/30`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15">
                <Building2 className="h-[18px] w-[18px] text-blue-300" aria-hidden />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-white">Lagring i EU</span>
                <span className="mt-0.5 block text-xs text-slate-400 sm:text-[13px]">Notablys egen drift</span>
              </span>
            </motion.div>

            <Connector label="Behandlet i EU" delay={0.6} />

            <motion.div variants={step(0.8)} className={node}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15">
                <FileCheck2 className="h-[18px] w-[18px] text-emerald-300" aria-hidden />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-white">Ditt referat</span>
                <span className="mt-0.5 block text-xs text-slate-400 sm:text-[13px]">AI kjørt i EU</span>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={step(1.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <span className="flex items-center gap-2 rounded-full border border-dashed border-white/20 py-1.5 pl-1.5 pr-3.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500">
                <Ban className="h-3 w-3 text-white" strokeWidth={3} aria-hidden />
              </span>
              <span className="text-sm font-medium text-slate-400 line-through decoration-slate-500">
                <span className="sr-only">Brukes aldri til </span>
                Modelltrening
              </span>
            </span>
          </motion.div>

          {/* Leverandørvurderingen */}
          <div className="mx-auto mt-16 max-w-4xl">
            <h3 className="text-balance text-center text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Spørsmålene du må kunne svare på om leverandørene dine
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-balance text-center text-[15px] leading-relaxed text-slate-400">
              Finanstilsynet forventer at byråets risikovurdering av IT dekker taushetsplikt og personvern, og at
              leverandøravtaler er skriftlige og kan avsluttes kontrollert.{' '}
              <a
                href={FINANSTILSYNET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 underline underline-offset-4 hover:text-white"
              >
                Les kravene hos Finanstilsynet
              </a>
            </p>

            <dl className="mt-8 divide-y divide-white/10 overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-inset ring-white/10">
              {checklist.map(({ question, answer }) => (
                <div key={question} className="grid gap-2 p-5 sm:grid-cols-[0.85fr_1.15fr] sm:gap-8 sm:p-6">
                  <dt className="text-[15px] font-semibold text-white">{question}</dt>
                  <dd className="flex gap-2.5 text-[15px] leading-relaxed text-slate-300">
                    <Check className="mt-[3px] h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.5} aria-hidden />
                    {answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="mx-auto mt-6 grid max-w-4xl gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-3">
            {extras.map(({ icon: Icon, title, text }) => (
              <li key={title} className="bg-slate-950 p-6 sm:p-7">
                <Icon className="h-5 w-5 text-blue-300" aria-hidden />
                <h3 className="mt-4 text-[17px] font-semibold text-white">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-400">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
