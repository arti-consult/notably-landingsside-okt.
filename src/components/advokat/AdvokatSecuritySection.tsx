import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  Ban,
  Building2,
  FileCheck2,
  KeyRound,
  Lock,
  Mic,
  ServerCog,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from './shared';

/**
 * Påstandene her skal stemme ord for ord med personvernerklæringen
 * (src/pages/PrivacyPolicy.tsx). Ikke legg til sertifiseringer eller garantier
 * vi ikke har – en advokat kommer til å sjekke.
 */
const guarantees: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ServerCog,
    title: 'Lagret i EU',
    text: 'Opptak, transkripsjoner og notater ligger på Notablys egen drift i EU – ikke i en amerikansk sky.',
  },
  {
    icon: Ban,
    title: 'Aldri brukt til AI-trening',
    text: 'Klientsamtalene dine brukes til å lage dine notater. Ikke til å trene modeller – verken våre eller andres.',
  },
  {
    icon: Lock,
    title: 'AI-behandling rutet i EU',
    text: 'Alt av AI-prosessering skjer i EU. Alt av informasjon kryptert under transport.',
  },
  {
    icon: FileCheck2,
    title: 'Firmaet eier dataene',
    text: 'Databehandleravtalen er automatisk på plass når dere blir kunde. Firmaet er behandlingsansvarlig, og alle underleverandører er bundet av databehandleravtaler.',
  },
  {
    icon: Trash2,
    title: 'Du bestemmer hvor lenge',
    text: 'Eksporter notatet til saksarkivet, og slett opptaket når du vil – ett enkelt møte eller hele arbeidsområdet.',
  },
  {
    icon: KeyRound,
    title: 'Adskilt og tilgangsstyrt',
    text: 'Firmaets møter er skilt fra alle andre kunder. Advokatfirmaer kan få SSO, så tilgang styres som resten av IT-en.',
  },
];

const node =
  'flex w-full max-w-[15rem] flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4 text-center sm:max-w-none sm:px-5 sm:py-5';

export default function AdvokatSecuritySection() {
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
          className="pointer-events-none absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[24rem] w-[24rem] rounded-full bg-indigo-500/15 blur-[120px]"
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-blue-300">Taushetsplikt og personvern</Eyebrow>
            <SectionHeading
              dark
              className="mt-5"
              lead="Taushetsplikten gjelder også verktøyene dine."
              muted="Derfor er Notably bygget slik."
            />
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-slate-300">
              Taushetsplikten etter advokatloven § 32 gjelder fra første samtale – også om et oppdrag du ennå ikke har
              tatt. Før du tar opp en klient, må du vite nøyaktig hvor samtalen havner og hva den brukes til.
            </p>
          </div>

          {/* Tallet som forklarer hvorfor seksjonen finnes */}
          <figure className="mx-auto mt-12 grid max-w-3xl gap-6 rounded-3xl bg-white/[0.04] p-6 ring-1 ring-inset ring-white/10 sm:grid-cols-2 sm:p-8">
            <div>
              <p className="text-5xl font-semibold tracking-tight text-white">45,7 %</p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-400">
                av norske jurister er utrygge på personvernet i KI-verktøyene de bruker.
              </p>
            </div>
            <div>
              <p className="text-5xl font-semibold tracking-tight text-white">2 %</p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-400">
                mener dagens løsninger ivaretar konfidensialitet godt nok.
              </p>
            </div>
            <figcaption className="text-xs text-slate-500 sm:col-span-2">
              Kilde:{' '}
              <a
                href="https://www.karnovgroup.no/fremtidens-jurist-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-slate-300 hover:underline"
              >
                Karnov, Fremtidens jurist 2025
              </a>{' '}
              (1 380 respondenter)
            </figcaption>
          </figure>

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-balance text-lg font-medium text-white">Så her er svaret – uten forbehold i finstilt skrift.</p>
          </div>

          {/* Dataflyten */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-10 flex flex-col items-center sm:grid sm:grid-cols-[1fr_minmax(4rem,0.7fr)_1fr_minmax(4rem,0.7fr)_1fr] sm:items-center"
          >
            <motion.div variants={step(0)} className={node}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Mic className="h-[18px] w-[18px] text-slate-900" aria-hidden />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-white">Klientmøtet</span>
                <span className="mt-0.5 block text-xs text-slate-400 sm:text-[13px]">Opptak på mobil eller digitalt</span>
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
                <span className="block text-[15px] font-semibold text-white">Ditt saksnotat</span>
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

          {/* Garantiene */}
          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {guarantees.map(({ icon: Icon, title, text }) => (
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
