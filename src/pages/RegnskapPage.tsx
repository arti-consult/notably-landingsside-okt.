import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import DeferredRender from '../components/DeferredRender';
import RegnskapHero from '../components/regnskap/RegnskapHero';
import RegnskapCustomers from '../components/regnskap/RegnskapCustomers';
import RegnskapPainSection from '../components/regnskap/RegnskapPainSection';
import { regnskapFaqs } from '../components/regnskap/faqs';
import { PrimaryCta, SecondaryCta } from '../components/advokat/shared';
import type { AIAnswerExample } from '../components/AIAnswersSection';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL, SITE_URL } from '../lib/seo';

const RegnskapMeetingTypesSection = lazy(() => import('../components/regnskap/RegnskapMeetingTypesSection'));
const RegnskapShareSection = lazy(() => import('../components/regnskap/RegnskapShareSection'));
const RegnskapChannelsSection = lazy(() => import('../components/regnskap/RegnskapChannelsSection'));
const RegnskapSecuritySection = lazy(() => import('../components/regnskap/RegnskapSecuritySection'));
const AIAnswersSection = lazy(() => import('../components/AIAnswersSection'));
const RegnskapRoiSection = lazy(() => import('../components/regnskap/RegnskapRoiSection'));
const RegnskapObjectionsSection = lazy(() => import('../components/regnskap/RegnskapObjectionsSection'));
const RegnskapPricingSection = lazy(() => import('../components/regnskap/RegnskapPricingSection'));
const FaqSection = lazy(() => import('../components/advokat/AdvokatFaqSection'));
const Footer = lazy(() => import('../components/Footer'));

const PAGE_URL = `${SITE_URL}/regnskapsforer`;
const TITLE = 'Notably for regnskapsførere: AI-referat fra kundemøter, lagret i EU';
const DESCRIPTION =
  'Notably skriver referatet fra kundemøter om årsoppgjør, lønn og rådgivning, med rådene du ga, frister og hva kunden skal sende. Lagret i EU, aldri brukt til AI-trening.';

/** Fortsetter kundene fra resten av siden: Nordvik fra heroen, Haug og Fjordlys fra møtetypene. */
const accountingExamples: AIAnswerExample[] = [
  {
    question: 'Hva rådet vi Nordvik Elektro om utbytte?',
    answer:
      'Utbytte framfor høyere lønn, så lenge likviditeten holder. Rådet skal vurderes på nytt i desember, og Tor fikk oppsummeringen på e-post samme dag.',
    source: 'Årsoppgjørsmøte · Nordvik Elektro AS · 12. februar',
  },
  {
    question: 'Når starter de nye tømrerne hos Haug Bygg?',
    answer:
      '1. november, i fast stilling 100 %. De skal med i a-meldingen for november, med frist 5. desember. Jonas får firmabil fra desember.',
    source: 'Lønnsavklaring · Haug Bygg AS · 5. oktober',
  },
  {
    question: 'Hvem eier Fjordlys Kafé?',
    answer:
      'Lina Strand eier 100 % gjennom Strand Holding AS. Firmaattest og aksjonærbok er etterspurt, og oppdragsavtalen sendes til signering innen torsdag.',
    source: 'Oppstartsmøte · Fjordlys Kafé AS · 29. september',
  },
];

export default function RegnskapPage() {
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
        audience: { '@type': 'BusinessAudience', name: 'Regnskapsførere og regnskapsbyråer' },
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
        mainEntity: regnskapFaqs.map(({ question, answer }) => ({
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
        <RegnskapHero />
      </div>
      <RegnskapCustomers />
      <RegnskapPainSection />
      <DeferredRender rootMargin="300px 0px">
        <Suspense fallback={null}>
          <RegnskapMeetingTypesSection />
          <RegnskapShareSection />
          <RegnskapChannelsSection />
          <RegnskapSecuritySection />
          <AIAnswersSection
            examples={accountingExamples}
            heading="Hva rådet vi kunden egentlig?"
            intro="Spør på tvers av alle møtene med en kunde, og få svaret med kilde. Også når det var en kollega som hadde møtet."
          />
          <RegnskapRoiSection />
          <RegnskapObjectionsSection />
          <RegnskapPricingSection />
          <FaqSection faqs={regnskapFaqs} muted="før første kundemøte." background="bg-gray-50" />

          <section className="page-container bg-white pb-24 pt-20 sm:pb-28 sm:pt-24">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-16 text-center sm:px-12 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-[90px]"
              />
              <h2 className="relative text-balance text-[2rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Neste råd du gir, står skriftlig.
              </h2>
              <p className="relative mx-auto mt-5 max-w-lg text-balance text-lg leading-relaxed text-blue-100">
                Prøv Notably gratis i 14 dager. Last ned appen eller koble til kalenderen, og send kunden
                oppsummeringen samme dag.
              </p>
              <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <PrimaryCta light placement="bottom">Start gratis</PrimaryCta>
                <SecondaryCta dark>Book demo for byrået</SecondaryCta>
              </div>
            </div>
          </section>

          <Footer />
        </Suspense>
      </DeferredRender>
    </div>
  );
}
