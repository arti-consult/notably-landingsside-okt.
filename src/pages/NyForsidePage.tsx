import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import DeferredRender from '../components/DeferredRender';
import NfNav from '../components/ny-forside/NfNav';
import NfHero from '../components/ny-forside/NfHero';
import NfLogos from '../components/ny-forside/NfLogos';
import NfManifesto from '../components/ny-forside/NfManifesto';
import ByggStickyCta from '../components/bygg/ByggStickyCta';

const NfJourney = lazy(() => import('../components/ny-forside/NfJourney'));
const NfAsk = lazy(() => import('../components/ny-forside/NfAsk'));
const NfFeatures = lazy(() => import('../components/ny-forside/NfFeatures'));
const NfStory = lazy(() => import('../components/ny-forside/NfStory'));
const NfSecurity = lazy(() => import('../components/ny-forside/NfSecurity'));
const NfPricing = lazy(() => import('../components/ny-forside/NfPricing'));
const NfFaq = lazy(() => import('../components/ny-forside/NfFaq'));
const NfFinal = lazy(() => import('../components/ny-forside/NfFinal'));
const Footer = lazy(() => import('../components/Footer'));

/**
 * Ny versjon av forsiden, til vurdering (november 2026).
 *
 * Ligger på /ny-forside og er bevisst ikke indeksert: meta noindex her og
 * X-Robots-Tag i vercel.json. Den er ikke i sitemap, nav eller
 * ACQUISITION_PATHS, så markedsføringsskriptene kjører ikke her. Ikke legg den
 * i robots.txt, for da blir adressen offentlig.
 */
export default function NyForsidePage() {
  return (
    <div className="min-h-screen bg-[#F6F5F1] text-slate-950 antialiased">
      <Helmet>
        <title>Notably: Vær til stede. Notably skriver referatet.</title>
        <meta
          name="description"
          content="Notably blir med i Teams, Zoom og Google Meet, eller tar opp fysiske møter på mobilen. Når møtet er slutt, ligger referatet klart. Lagret i EU."
        />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://notably.no/" />
      </Helmet>

      <NfNav />
      <main>
        <NfHero />
        <NfLogos />
        <NfManifesto />
        <DeferredRender>
          <NfJourney />
          <NfAsk />
          <NfFeatures />
          <NfStory />
          <NfSecurity />
          <NfPricing />
          <NfFaq />
          <NfFinal />
          <Footer />
        </DeferredRender>
      </main>
      <ByggStickyCta />
    </div>
  );
}
