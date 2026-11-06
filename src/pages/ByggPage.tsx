import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import DeferredRender from '../components/DeferredRender';
import ByggHero from '../components/bygg/ByggHero';
import ByggCustomers from '../components/bygg/ByggCustomers';
import ByggDaySection from '../components/bygg/ByggDaySection';
import ByggStickyCta from '../components/bygg/ByggStickyCta';
import { byggFaqs } from '../components/bygg/faqs';
import { PrimaryCta, SecondaryCta } from '../components/advokat/shared';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL, SITE_URL } from '../lib/seo';

const ByggStepsSection = lazy(() => import('../components/bygg/ByggStepsSection'));
const ByggProofSection = lazy(() => import('../components/bygg/ByggProofSection'));
const ByggProjectSection = lazy(() => import('../components/bygg/ByggProjectSection'));
const ByggRoiSection = lazy(() => import('../components/bygg/ByggRoiSection'));
const ByggTrustSection = lazy(() => import('../components/bygg/ByggTrustSection'));
const ByggPricingSection = lazy(() => import('../components/bygg/ByggPricingSection'));
const FaqSection = lazy(() => import('../components/advokat/AdvokatFaqSection'));
const Footer = lazy(() => import('../components/Footer'));

const PAGE_URL = `${SITE_URL}/bygg-og-anlegg`;
const TITLE = 'Notably for bygg og anlegg: AI-referat fra byggemøter og befaringer';
const DESCRIPTION =
  'Legg telefonen på bordet i brakka. Notably skriver referatet fra byggemøtet med hvem som sa hva, hvem som gjør hva og innen når. Klart til å sendes når møtet er over. Lagret i EU.';

export default function ByggPage() {
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
        audience: { '@type': 'BusinessAudience', name: 'Entreprenører, byggherrer og rådgivere i bygg og anlegg' },
        isPartOf: { '@type': 'WebSite', name: 'Notably', url: `${SITE_URL}/` },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Notably',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS, Android',
        inLanguage: 'nb',
        url: PAGE_URL,
        offers: { '@type': 'Offer', price: '399', priceCurrency: 'NOK' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: byggFaqs.map(({ question, answer }) => ({
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
        <ByggHero />
      </div>
      <ByggCustomers />
      <ByggDaySection />
      <DeferredRender>
        <ByggStepsSection />
        <ByggProofSection />
        <ByggProjectSection />
        <ByggRoiSection />
        <ByggTrustSection />
        <ByggPricingSection />
        <FaqSection faqs={byggFaqs} muted="før første byggemøte." background="bg-white" />

        <section data-hide-sticky-cta className="page-container bg-white pb-24 pt-8 sm:pb-28 sm:pt-12">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 glow scale-[1.94]"
            />
            <h2 className="relative text-balance text-[2rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Neste byggemøte er skrevet før du går ut av brakka.
            </h2>
            <p className="relative mx-auto mt-5 max-w-lg text-balance text-lg leading-relaxed text-blue-100">
              Prøv gratis i 14 dager. Last ned appen, trykk opptak, og send referatet til alle parter samme dag.
            </p>
            <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <PrimaryCta light placement="bottom">Start gratis</PrimaryCta>
              <SecondaryCta dark demoPlacement="bottom">Book demo for firmaet</SecondaryCta>
            </div>
          </div>
        </section>

        <Footer />
      </DeferredRender>
      <ByggStickyCta />
    </div>
  );
}
