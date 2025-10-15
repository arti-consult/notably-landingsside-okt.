import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, CreditCard as Edit, Trash2, Eye, Search, Filter } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  view_count: number;
  reading_time_minutes: number;
  created_at: string;
  updated_at: string;
  article_categories: { name: string } | null;
}

export default function ArticleList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    let query = supabase
      .from('articles')
      .select(`
        *,
        article_categories (name)
      `)
      .order('updated_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (data) {
      setArticles(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, [statusFilter]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Er du sikker på at du vil slette denne artikkelen?')) {
      return;
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (!error) {
      setArticles(articles.filter(a => a.id !== id));
    } else {
      alert('Kunne ikke slette artikkelen');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      archived: 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800';

    const labels = {
      draft: 'Utkast',
      published: 'Publisert',
      scheduled: 'Planlagt',
      archived: 'Arkivert',
    }[status] || status;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}>
        {labels}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Artikler</h1>
            <p className="text-gray-600 mt-2">Administrer artikler og blogginnlegg</p>
          </div>
          <button
            onClick={() => navigate('/admin/articles/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Ny artikkel
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Søk etter artikler..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Alle statuser</option>
                  <option value="draft">Utkast</option>
                  <option value="published">Publisert</option>
                  <option value="scheduled">Planlagt</option>
                  <option value="archived">Arkivert</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Laster artikler...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Ingen artikler funnet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tittel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visninger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oppdatert
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Handlinger
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {article.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            /blog/{article.slug}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {article.article_categories?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Eye className="w-4 h-4" />
                          {article.view_count}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(article.updated_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Rediger"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {article.status === 'published' && (
                            <button
                              onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="Vis"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Slett"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Viser {filteredArticles.length} av {articles.length} artikler
        </div>
      </div>
    </div>
  );
}
