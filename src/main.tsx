import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { startMarketingScriptsLoader } from './lib/marketing-loader.ts';
import { landingAnalytics } from './lib/posthog-landing.ts';

const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const BlogListing = lazy(() => import('./pages/BlogListing.tsx'));
const ArticlePage = lazy(() => import('./pages/ArticlePage.tsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.tsx'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse.tsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.tsx'));
const AdvokatPage = lazy(() => import('./pages/AdvokatPage.tsx'));
const RegnskapPage = lazy(() => import('./pages/RegnskapPage.tsx'));
const ByggPage = lazy(() => import('./pages/ByggPage.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));
const ConsentManager = lazy(() => import('./components/ConsentManager.tsx'));
const DemoBookingModal = lazy(() => import('./components/DemoBookingModal.tsx'));

function BlogSlugRedirect() {
  const { slug = '' } = useParams<{ slug: string }>();
  const location = useLocation();
  return <Navigate to={`/artikler/${slug}${location.search}${location.hash}`} replace />;
}

function PublicRedirect({ to }: { to: string }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
}

/** Rechecks shared server consent when entering a public page. */
function MarketingScriptsLoader() {
  const location = useLocation();
  useEffect(() => {
    return startMarketingScriptsLoader();
  }, [location.pathname]);

  return null;
}

/** Independent analytics lifecycle; it never writes to the advertising providers. */
function LandingAnalyticsLoader() {
  const location = useLocation();
  useEffect(() => { void landingAnalytics().sync(); }, [location.pathname, location.search, location.hash]);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <MarketingScriptsLoader />
        <LandingAnalyticsLoader />
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/personvern" element={<PrivacyPolicy />} />
            <Route path="/vilkar" element={<TermsOfUse />} />
            <Route path="/om-oss" element={<AboutPage />} />
            <Route path="/advokat" element={<AdvokatPage />} />
            <Route path="/advokater" element={<PublicRedirect to="/advokat" />} />
            <Route path="/regnskapsforer" element={<RegnskapPage />} />
            <Route path="/regnskapsforere" element={<PublicRedirect to="/regnskapsforer" />} />
            <Route path="/regnskapsbyra" element={<PublicRedirect to="/regnskapsforer" />} />
            <Route path="/bygg-og-anlegg" element={<ByggPage />} />
            <Route path="/bygg" element={<PublicRedirect to="/bygg-og-anlegg" />} />
            <Route path="/entreprenor" element={<PublicRedirect to="/bygg-og-anlegg" />} />
            <Route path="/byggebransjen" element={<PublicRedirect to="/bygg-og-anlegg" />} />
            <Route path="/artikler" element={<BlogListing />} />
            <Route path="/artikler/:slug" element={<ArticlePage />} />
            <Route path="/blog" element={<PublicRedirect to="/artikler" />} />
            <Route path="/blog/:slug" element={<BlogSlugRedirect />} />
            <Route path="/blogg" element={<PublicRedirect to="/artikler" />} />
            <Route path="/blogg/:slug" element={<BlogSlugRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ConsentManager />
          <DemoBookingModal />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
