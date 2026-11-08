import { ArrowRight, Building2, Check, HardHat } from 'lucide-react';
import { CONTACT_EMAIL, DEMO_URL, Eyebrow, SIGNUP_URL, SectionHeading } from '../advokat/shared';

const soloFeatures = [
  'Referat fra byggemøter, befaringer og digitale møter',
  'Navn på hvem som sa hva',
  'Oppgaver med ansvarlig og frist',
  'Prosjektmapper, og søk på tvers av møtene',
  'Send referatet til alle parter',
  'App for iPhone og Android',
];

const firmFeatures = [
  'Alt i Prosjektleder',
  'Felles maler for alle prosjektene',
  'SSO og samlet brukeradministrasjon',
  'Onboarding for prosjektledere og byggeledere',
  'Volumpris og fast kontaktperson',
];

const FeatureList = ({ items, dark = false }: { items: string[]; dark?: boolean }) => (
  <ul className="space-y-3">
    {items.map((feature) => (
      <li key={feature} className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-white/10' : 'bg-blue-100'}`}
        >
          <Check className={`h-3 w-3 ${dark ? 'text-amber-300' : 'text-blue-600'}`} strokeWidth={3} aria-hidden />
        </span>
        <span className={`text-[15px] leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{feature}</span>
      </li>
    ))}
  </ul>
);

/** To veier, side om side: prøv selv i dag, eller få hele firmaet med via en demo. */
export default function ByggPricingSection() {
  return (
    <section id="pris" data-hide-sticky-cta className="page-container scroll-mt-24 bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Kom i gang</Eyebrow>
          <SectionHeading className="mt-5" lead="Prøv selv i morgen." muted="Eller få med hele firmaet." />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="relative flex flex-col rounded-[2rem] bg-white p-7 shadow-xl ring-2 ring-blue-600 sm:p-9">
            <span className="absolute -top-3.5 right-7 rounded-full bg-blue-600 px-3.5 py-1 text-sm font-medium text-white">
              14 dager gratis
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400">
              <HardHat className="h-5 w-5 text-slate-900" aria-hidden />
            </span>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">Prosjektleder</h3>
            <p className="mt-1.5 text-slate-600">For deg som vil starte på neste byggemøte.</p>
            <p className="mt-6 text-[2.6rem] font-bold leading-none tracking-tight text-slate-900">399,-</p>
            <p className="mt-2 text-slate-600">per bruker / mnd eks. mva.</p>
            <a
              data-trial-cta="pricing"
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white shadow-[0_14px_30px_-16px_rgba(37,99,235,0.7)] transition-colors hover:bg-blue-700"
            >
              Start 14 dager gratis
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <div className="mt-7 border-t border-slate-200 pt-7">
              <FeatureList items={soloFeatures} />
            </div>
          </div>

          <div className="flex flex-col rounded-[2rem] bg-slate-950 p-7 text-white sm:p-9">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <Building2 className="h-5 w-5 text-amber-300" aria-hidden />
            </span>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">Firma</h3>
            <p className="mt-1.5 text-slate-400">For entreprenører, byggherrer og rådgivere med flere prosjekter.</p>
            <p className="mt-6 text-[2.6rem] font-bold leading-none tracking-tight">Tilbud</p>
            <p className="mt-2 text-slate-400">Pris etter antall brukere.</p>
            <a
              data-demo-cta="pricing"
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center rounded-2xl bg-white py-4 text-lg font-semibold text-slate-900 transition-colors hover:bg-blue-50"
            >
              Book demo for firmaet
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Notably%20for%20bygg%20og%20anlegg`}
              className="mt-3 block text-center text-sm font-medium text-slate-400 hover:text-white"
            >
              eller skriv til {CONTACT_EMAIL}
            </a>
            <div className="mt-7 border-t border-white/10 pt-7">
              <FeatureList items={firmFeatures} dark />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
