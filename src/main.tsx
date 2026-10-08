import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
  return <Navigate to={`/artikler/${slug}`} replace />;
}

/**
 * Laster de valgfrie sporingsverktøyene – men bare hvis besøkende allerede har
 * sagt ja i Personvernvalg. Uten et lagret samtykke skjer ingenting her, og
 * ConsentManager tar seg av å starte dem i det øyeblikket samtykket gis.
 */
function MarketingScriptsLoader() {
  useEffect(() => {
    if (!import.meta.env.PROD) {
      return;
    }

    return startMarketingScriptsLoader();
  }, []);

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
              <Route path="/advokater" element={<Navigate to="/advokat" replace />} />
              <Route path="/regnskapsforer" element={<RegnskapPage />} />
              <Route path="/regnskapsforere" element={<Navigate to="/regnskapsforer" replace />} />
              <Route path="/regnskapsbyra" element={<Navigate to="/regnskapsforer" replace />} />
              <Route path="/bygg-og-anlegg" element={<ByggPage />} />
              <Route path="/bygg" element={<Navigate to="/bygg-og-anlegg" replace />} />
              <Route path="/entreprenor" element={<Navigate to="/bygg-og-anlegg" replace />} />
              <Route path="/byggebransjen" element={<Navigate to="/bygg-og-anlegg" replace />} />
              <Route path="/artikler" element={<BlogListing />} />
              <Route path="/artikler/:slug" element={<ArticlePage />} />
              <Route path="/blog" element={<Navigate to="/artikler" replace />} />
              <Route path="/blog/:slug" element={<BlogSlugRedirect />} />
              <Route path="/blogg" element={<Navigate to="/artikler" replace />} />
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
