import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import AppDemoSection from '../components/AppDemoSection';
import TypewriterSection from '../components/TypewriterSection';
import MeetingSummarySection from '../components/MeetingSummarySection';
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="relative bg-gradient-to-b from-blue-50/40 via-amber-50/30 to-gray-50">
        <HeroSection />
        <AppDemoSection />
      </div>
      {/* <TrustSection /> */}
      <TypewriterSection />
      <MeetingSummarySection />
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
