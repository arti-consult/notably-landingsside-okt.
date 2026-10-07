import { Check } from 'lucide-react';
import { CONTACT_EMAIL, DEMO_URL, Eyebrow, SIGNUP_URL, SectionHeading } from '../advokat/shared';

const soloFeatures = [
  'Referater fra byggemøter, befaringer og prosjekteringsmøter',
  'Navn på hvem som sa hva',
  'Beslutninger og oppgaver med ansvarlig og frist',
  'Egne maler for møtene dine',
  'Prosjektmapper, og søk og spør på tvers av møtene',
  'Send referatet til alle parter, eller last det ned',
  'Mobilapp for iPhone og Android, bot for Teams, Zoom og Meet',
  'Lagret i EU, aldri brukt til AI-trening',
  'Databehandleravtale inkludert',
  'Norsk support',
];

const firmFeatures = [
  'Alt i Prosjektleder',
  'SSO og samlet brukeradministrasjon',
  'Felles maler for alle prosjektene',
  'Oversikt over underleverandører',
  'Onboarding for prosjektledere og byggeledere',
  'Volumpris og dedikert kontaktperson',
];

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((feature) => (
      <li key={feature} className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <Check className="h-2.5 w-2.5 text-blue-600" strokeWidth={3} aria-hidden />
        </span>
        <span className="text-[15px] leading-relaxed text-slate-700">{feature}</span>
      </li>
    ))}
  </ul>
);

export default function ByggPricingSection() {
  return (
    <section id="pris" className="page-container scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Pris</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="Mindre enn en time i måneden."
            muted="De andre i møtet får referatet på e-post."
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="relative flex flex-col rounded-3xl bg-white p-7 ring-2 ring-blue-600 shadow-xl sm:p-8">
            <span className="absolute -top-3.5 right-6 rounded-full bg-blue-600 px-3.5 py-1 text-sm font-medium text-white">
              14 dager gratis
            </span>
            <h3 className="text-xl font-semibold text-slate-900">Prosjektleder</h3>
            <p className="mt-2 text-slate-600">For deg som vil starte på neste byggemøte, alene eller med noen få kolleger.</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-[2.55rem] font-bold tracking-tight text-slate-900">399,-</span>
            </p>
            <p className="text-slate-600">per bruker / mnd eks. mva.</p>
            <div className="mt-7 flex-grow">
              <FeatureList items={soloFeatures} />
            </div>
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block rounded-full bg-blue-600 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
            >
              Start 14 dager gratis
            </a>
          </div>

          <div className="flex flex-col rounded-3xl bg-white p-7 shadow-lg ring-1 ring-slate-200/70 sm:p-8">
            <h3 className="text-xl font-semibold text-slate-900">Firma</h3>
            <p className="mt-2 text-slate-600">For entreprenører, byggherrer og rådgivere med flere prosjekter og felles rutiner.</p>
            <p className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Tilbud etter behov</p>
            <p className="mt-2 text-slate-600">Pris etter antall brukere og oppsett.</p>
            <div className="mt-7 flex-grow">
              <FeatureList items={firmFeatures} />
            </div>
            <div className="mt-8 grid gap-2.5">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-slate-900 py-3 text-center font-medium text-white transition-colors hover:bg-black"
              >
                Book demo for firmaet
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Notably%20for%20bygg%20og%20anlegg`}
                className="block py-1.5 text-center text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                eller skriv til {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
