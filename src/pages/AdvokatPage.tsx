import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import TrustSection from '../components/TrustSection';
import DeferredRender from '../components/DeferredRender';
import AdvokatHero from '../components/advokat/AdvokatHero';
import AdvokatPainSection from '../components/advokat/AdvokatPainSection';
import { advokatFaqs } from '../components/advokat/faqs';
import { PrimaryCta, SecondaryCta } from '../components/advokat/shared';
import type { AIAnswerExample } from '../components/AIAnswersSection';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL, SITE_URL } from '../lib/seo';

const AdvokatMeetingTypesSection = lazy(() => import('../components/advokat/AdvokatMeetingTypesSection'));
const AdvokatSecuritySection = lazy(() => import('../components/advokat/AdvokatSecuritySection'));
const AdvokatChannelsSection = lazy(() => import('../components/advokat/AdvokatChannelsSection'));
const AIAnswersSection = lazy(() => import('../components/AIAnswersSection'));
const AdvokatRoiSection = lazy(() => import('../components/advokat/AdvokatRoiSection'));
const AdvokatPricingSection = lazy(() => import('../components/advokat/AdvokatPricingSection'));
const AdvokatFaqSection = lazy(() => import('../components/advokat/AdvokatFaqSection'));
const Footer = lazy(() => import('../components/Footer'));

const PAGE_URL = `${SITE_URL}/advokat`;
const TITLE = 'Notably for advokater – AI-notater fra klientmøter, lagret i EU';
const DESCRIPTION =
  'Notably skriver notatet fra klientmøter, forhandlinger og saksmøter – med faktum, frister og neste steg. Lagret i EU, aldri brukt til AI-trening.';

/** Fortsetter sakene fra resten av siden: Nordvik og Berg fra møtetypene, Hansen fra heroen. */
const legalExamples: AIAnswerExample[] = [
  {
    question: 'Hva var kjøpers siste bud i Nordvik?',
    answer:
      '76 MNOK pluss earn-out på inntil 8 MNOK. Selger aksepterte 24 måneders garantiperiode, mens beløpsgrensen for garantikrav fortsatt er uavklart.',
    source: 'Forhandlingsmøte · Nordvik AS · 28. september',
  },
  {
    question: 'Hva sa Hansen om hvordan oppsigelsen ble gitt?',
    answer:
      'Oppsigelsen kom på e-post 12. mars, etter et kort møte med daglig leder samme morgen. Ingen tillitsvalgt var til stede, og hun fikk ikke tilbud om drøftelsesmøte.',
    source: 'Klientmøte · Oppsigelsessak · 14. mars',
  },
  {
    question: 'Hvilke frister gjelder i Berg-saken?',
    answer:
      'Tora leverer utkast til tilsvar innen 15. oktober. Marius kontakter sakkyndig denne uken. Planmøte med retten er satt til 4. november.',
    source: 'Saksgjennomgang · Arbeidsrett · 1. oktober',
  },
];

export default function AdvokatPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': PAGE_URL,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: 'nb',
        audience: { '@type': 'BusinessAudience', name: 'Advokater og advokatfirmaer' },
        isPartOf: { '@type': 'WebSite', name: 'Notably', url: `${SITE_URL}/` },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Notably',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS',
        inLanguage: 'nb',
        url: PAGE_URL,
        offers: { '@type': 'Offer', price: '399', priceCurrency: 'NOK' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: advokatFaqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Notably" />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <meta property="og:image:alt" content={DEFAULT_SOCIAL_IMAGE_ALT} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Navigation pricingTarget="pris" />
      <div className="relative overflow-hidden bg-gradient-to-b from-[#F7F9FF] via-white to-white">
        <AdvokatHero />
      </div>
      <TrustSection />
      <AdvokatPainSection />
      <DeferredRender rootMargin="300px 0px">
        <Suspense fallback={null}>
          <AdvokatMeetingTypesSection />
          <AdvokatSecuritySection />
          <AdvokatChannelsSection />
          <AIAnswersSection
            examples={legalExamples}
            heading="Hva sa motparten egentlig?"
            intro="Spør på tvers av alle møtene i saken – og få svaret med kilde, enten møtet var i går eller for et år siden."
          />
          <AdvokatRoiSection />
          <AdvokatPricingSection />
          <AdvokatFaqSection />

          <section className="page-container bg-white pb-24 pt-4 sm:pb-28">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-16 text-center sm:px-12 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-[90px]"
              />
              <h2 className="relative text-balance text-[2rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Bruk neste klientmøte på klienten.
              </h2>
              <p className="relative mx-auto mt-5 max-w-lg text-balance text-lg leading-relaxed text-blue-100">
                Prøv Notably gratis i 14 dager. Du er i gang på få minutter – og første notat er klart før klienten
                har gått.
              </p>
              <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <PrimaryCta light>Start gratis</PrimaryCta>
                <SecondaryCta dark>Book demo for firmaet</SecondaryCta>
              </div>
            </div>
          </section>

          <Footer />
        </Suspense>
      </DeferredRender>
    </div>
  );
}
