import { Check } from 'lucide-react';
import { CONTACT_EMAIL, DEMO_URL, Eyebrow, SIGNUP_URL, SectionHeading } from '../advokat/shared';

const soloFeatures = [
  'Referater fra kundemøter, årsoppgjør, lønn og rådgivning',
  'Egne maler for oppstart, årsoppgjør og rådgivning',
  'Send referatet til kunden på e-post, eller last det ned',
  'Søk og spør på tvers av alle møter med en kunde',
  'Mobilapp for fysiske møter, bot for Teams, Zoom og Meet',
  'Lagret i EU, aldri brukt til AI-trening',
  'Databehandleravtale inkludert',
  'Norsk support',
];

const firmFeatures = [
  'Alt i Regnskapsfører',
  'SSO og samlet brukeradministrasjon',
  'Oversikt over underleverandører',
  'Hjelp med leverandørvurdering og risikovurdering',
  'Felles maler for hele byrået',
  'Onboarding for kundeansvarlige og team',
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

export default function RegnskapPricingSection() {
  return (
    <section id="pris" className="page-container scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Pris</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="Koster mindre enn en halvtime i måneden."
            muted="Regnet i vanlig timepris."
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="relative flex flex-col rounded-3xl bg-white p-7 ring-2 ring-blue-600 shadow-xl sm:p-8">
            <span className="absolute -top-3.5 right-6 rounded-full bg-blue-600 px-3.5 py-1 text-sm font-medium text-white">
              14 dager gratis
            </span>
            <h3 className="text-xl font-semibold text-slate-900">Regnskapsfører</h3>
            <p className="mt-2 text-slate-600">For deg som vil starte i dag, alene eller med et lite team.</p>
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
            <h3 className="text-xl font-semibold text-slate-900">Regnskapsbyrå</h3>
            <p className="mt-2 text-slate-600">For byråer med krav til innkjøp, sikkerhet og felles rutiner.</p>
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
                Book demo for byrået
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Notably%20for%20regnskapsbyr%C3%A5`}
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
