import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { startMarketingScriptsLoader } from './lib/marketing-loader.ts';

const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.tsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.tsx'));
const ArticleList = lazy(() => import('./pages/ArticleList.tsx'));
const ArticleManagement = lazy(() => import('./pages/ArticleManagement.tsx'));
const BlogListing = lazy(() => import('./pages/BlogListing.tsx'));
const ArticlePage = lazy(() => import('./pages/ArticlePage.tsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.tsx'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse.tsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.tsx'));
const AdvokatPage = lazy(() => import('./pages/AdvokatPage.tsx'));
const RegnskapPage = lazy(() => import('./pages/RegnskapPage.tsx'));
const ByggPage = lazy(() => import('./pages/ByggPage.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute.tsx'));
const ConsentManager = lazy(() => import('./components/ConsentManager.tsx'));

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <MarketingScriptsLoader />
        <AuthProvider>
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
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles"
                element={
                  <ProtectedRoute>
                    <ArticleList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles/new"
                element={
                  <ProtectedRoute>
                    <ArticleManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles/edit/:id"
                element={
                  <ProtectedRoute>
                    <ArticleManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ConsentManager />
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
