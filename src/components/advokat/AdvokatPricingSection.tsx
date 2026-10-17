import { Check } from 'lucide-react';
import { usePricingUsage } from '../../lib/use-pricing-usage';
import { recordUsageEvent } from '../../lib/usage-events';
import { CONTACT_EMAIL, DEMO_URL, Eyebrow, SIGNUP_URL, SectionHeading } from './shared';

const soloFeatures = [
  'Notater fra klientmøter, forhandlinger og saksmøter',
  'Egne maler for inntak, forhandling og saksgjennomgang',
  'Søk og spør på tvers av alle møter',
  'Mobilapp for fysiske møter, bot for Teams, Zoom og Meet',
  'Lagret i EU, aldri brukt til AI-trening',
  'Databehandleravtale inkludert',
  'Norsk support',
];

const firmFeatures = [
  'Alt i Advokat',
  'SSO og samlet brukeradministrasjon',
  'Gjennomgang av underleverandører',
  'Hjelp med leverandørskjema og sikkerhetsvurdering',
  'Felles maler for hele firmaet',
  'Onboarding for partnere, advokater og fullmektiger',
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

export default function AdvokatPricingSection() {
  const pricingRef = usePricingUsage('advokat');
  return (
    <section ref={pricingRef} id="pris" className="page-container scroll-mt-24 bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Pris</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="Koster mindre enn et kvarter."
            muted="Av én fakturerbar time i måneden."
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="relative flex flex-col rounded-3xl bg-white p-7 ring-2 ring-blue-600 shadow-xl sm:p-8">
            <span className="absolute -top-3.5 right-6 rounded-full bg-blue-600 px-3.5 py-1 text-sm font-medium text-white">
              14 dager gratis
            </span>
            <h3 className="text-xl font-semibold text-slate-900">Advokat</h3>
            <p className="mt-2 text-slate-600">For deg som vil starte i dag – alene eller med et lite team.</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-[2.55rem] font-bold tracking-tight text-slate-900">399,-</span>
            </p>
            <p className="text-slate-600">per bruker / mnd eks. mva.</p>
            <div className="mt-7 flex-grow">
              <FeatureList items={soloFeatures} />
            </div>
            <a
              data-trial-cta="pricing"
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block rounded-full bg-blue-600 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
            >
              Start 14 dager gratis
            </a>
          </div>

          <div className="flex flex-col rounded-3xl bg-white p-7 shadow-lg sm:p-8">
            <h3 className="text-xl font-semibold text-slate-900">Advokatfirma</h3>
            <p className="mt-2 text-slate-600">For firmaer med krav til innkjøp, sikkerhet og felles rutiner.</p>
            <p className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Tilbud etter behov</p>
            <p className="mt-2 text-slate-600">Pris etter antall brukere og oppsett.</p>
            <div className="mt-7 flex-grow">
              <FeatureList items={firmFeatures} />
            </div>
            <div className="mt-8 grid gap-2.5">
              <a
                href={DEMO_URL}
                onClick={() => { recordUsageEvent('sales.clicked', 'advokat'); }}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-slate-900 py-3 text-center font-medium text-white transition-colors hover:bg-black"
              >
                Book demo for firmaet
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Notably%20for%20advokatfirma`}
                onClick={() => { recordUsageEvent('sales.clicked', 'advokat'); }}
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
