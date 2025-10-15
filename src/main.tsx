import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import HomePage from './pages/HomePage.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import ArticleList from './pages/ArticleList.tsx';
import ArticleManagement from './pages/ArticleManagement.tsx';
import BlogListing from './pages/BlogListing.tsx';
import ArticlePage from './pages/ArticlePage.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import ByggReisDeg from './pages/ByggReisDeg.tsx';
import ByggReisDegNoSpace from './pages/ByggReisDegNoSpace.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/personvern" element={<PrivacyPolicy />} />
            <Route path="/bygg-reis-deg" element={<Navigate to="/byggreisdeg" replace />} />
            <Route path="/byggreisdeg" element={<ByggReisDegNoSpace />} />
            <Route path="/blog" element={<BlogListing />} />
            <Route path="/blog/:slug" element={<ArticlePage />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
