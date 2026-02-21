import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import TrustSection from '../components/TrustSection';
import MeetingSummarySection from '../components/MeetingSummarySection';
import TestimonialSection from '../components/TestimonialSection';
import SecuritySection from '../components/SecuritySection';
import AIAnswersSection from '../components/AIAnswersSection';
import IntegrationsSection from '../components/IntegrationsSection';
import AllMeetingsSection from '../components/AllMeetingsSection';
import UseCasesSection from '../components/UseCasesSection';
import PricingSection from '../components/PricingSection';
import ProblemSection from '../components/ProblemSection';
import FeaturesGrid from '../components/FeaturesGrid';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Notably',
        url: 'https://notably.no/',
        logo: 'https://notably.no/Notably%20logo%20icon.svg',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Notably',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: 'nb',
        url: 'https://notably.no/',
        offers: {
          '@type': 'Offer',
          price: '399',
          priceCurrency: 'NOK',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Notably - AI Møteassistent for Norske Bedrifter | Automatiske Møtereferater</title>
        <meta
          name="description"
          content="Notably er den norske AI-møteassistenten som automatisk tar møtenotater, skriver referater og besvarer spørsmål om møtene dine. Spar timer hver uke med AI-teknologi spesialtrent for norsk."
        />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <link rel="canonical" href="https://notably.no/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:url" content="https://notably.no/" />
        <meta property="og:title" content="Notably - AI Møteassistent for Norske Bedrifter | Automatiske Møtereferater" />
        <meta
          property="og:description"
          content="Notably er den norske AI-møteassistenten som automatisk tar møtenotater, skriver referater og besvarer spørsmål om møtene dine."
        />
        <meta property="og:image" content="https://notably.no/Notably%20logo%20icon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Notably - AI Møteassistent for Norske Bedrifter | Automatiske Møtereferater" />
        <meta
          name="twitter:description"
          content="Notably er den norske AI-møteassistenten som automatisk tar møtenotater, skriver referater og besvarer spørsmål om møtene dine."
        />
        <meta name="twitter:image" content="https://notably.no/Notably%20logo%20icon.svg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <Navigation />
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-blue-50/70 to-gray-50">
        <HeroSection />
        <div aria-hidden className="h-20 bg-gradient-to-b from-gray-50 to-white" />
      </div>
      <TrustSection />
      <MeetingSummarySection />
      <TestimonialSection />
      <SecuritySection />
      <AIAnswersSection />
      <IntegrationsSection />
      <AllMeetingsSection />

      <UseCasesSection />
      <PricingSection />
      <ProblemSection />
      <FeaturesGrid />
      <CTASection />
      <Footer />
    </div>
  );
}
