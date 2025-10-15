import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Image, FileText, Settings } from 'lucide-react';
import ImageManagement from '../components/ImageManagement';
import AdminProfileSettings from '../components/AdminProfileSettings';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'images' | 'articles' | 'settings'>('overview');
  const [imageCount, setImageCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    loadImageCount();
    loadArticleCount();
  }, []);

  const loadImageCount = async () => {
    const { count } = await supabase
      .from('media_library')
      .select('*', { count: 'exact', head: true });

    setImageCount(count || 0);
  };

  const loadArticleCount = async () => {
    const { count } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    setArticleCount(count || 0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/Notably logo icon.svg" alt="Notably" className="h-8" />
              <span className="text-gray-400">|</span>
              <span className="text-sm font-medium text-gray-600">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logg ut
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeSection === 'overview' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Velkommen til Admin Panel</h1>
              <p className="text-gray-600 mt-2">Administrer innhold og innstillinger for Notably</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveSection('images')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Image className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bilder</h3>
                <p className="text-sm text-gray-600">Administrer bilder og media</p>
              </div>

              <div
                onClick={() => navigate('/admin/articles')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Artikler</h3>
                <p className="text-sm text-gray-600">Administrer bloggartikler</p>
              </div>

              <div
                onClick={() => setActiveSection('settings')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Innstillinger</h3>
                <p className="text-sm text-gray-600">Generelle innstillinger</p>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rask statistikk</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Totalt antall bilder</p>
                  <p className="text-3xl font-bold text-gray-900">{imageCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Totalt antall artikler</p>
                  <p className="text-3xl font-bold text-gray-900">{articleCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aktive sider</p>
                  <p className="text-3xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'images' && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <button
                  onClick={() => setActiveSection('overview')}
                  className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-1"
                >
                  ← Tilbake til oversikt
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Bildehåndtering</h1>
                <p className="text-gray-600 mt-2">Last opp, rediger og slett bilder</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ImageManagement />
            </div>
          </>
        )}


        {activeSection === 'settings' && (
          <>
            <div className="mb-8">
              <button
                onClick={() => setActiveSection('overview')}
                className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-1"
              >
                ← Tilbake til oversikt
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Innstillinger</h1>
              <p className="text-gray-600 mt-2">Administrer dine brukerinnstillinger</p>
            </div>
            <AdminProfileSettings />
          </>
        )}
      </main>
    </div>
  );
}
