import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Clock, Search } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string;
  reading_time_minutes: number;
  author_id: string;
  article_categories: { name: string; slug: string } | null;
  media_library: { public_url: string; alt_text: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function BlogListing() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, [selectedCategory]);

  const loadArticles = async () => {
    setLoading(true);

    let query = supabase
      .from('articles')
      .select(`
        *,
        article_categories (name, slug),
        media_library (public_url, alt_text)
      `)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data } = await query;

    if (data) {
      setArticles(data as Article[]);
    }

    setLoading(false);
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('article_categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>Artikler - Notably</title>
        <meta name="description" content="Les artikler om møtereferat, AI-transkripsjon, produktivitet og mer fra Notably." />
        <link rel="canonical" href="https://notably.no/artikler" />
      </Helmet>

      <Navigation />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12 text-gray-600">
              Laster artikler...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Ingen artikler funnet</p>
            </div>
          ) : (
            <>
              {featuredArticle && (
                <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                  {featuredArticle.media_library && (
                    <Link to={`/artikler/${featuredArticle.slug}`} className="block">
                      <img
                        src={featuredArticle.media_library.public_url}
                        alt={featuredArticle.media_library.alt_text}
                        className="w-full h-full object-cover min-h-[300px] lg:min-h-[400px]"
                      />
                    </Link>
                  )}
                  <div className={`p-8 lg:p-12 flex flex-col justify-center ${!featuredArticle.media_library ? 'lg:col-span-2' : ''}`}>
                    {featuredArticle.article_categories && (
                      <span className="inline-block text-sm font-medium text-gray-500 mb-3">
                        {featuredArticle.article_categories.name}
                      </span>
                    )}

                    <Link to={`/artikler/${featuredArticle.slug}`}>
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                        {featuredArticle.title}
                      </h2>
                    </Link>

                    {featuredArticle.excerpt && (
                      <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <time dateTime={featuredArticle.published_at}>
                        {formatDate(featuredArticle.published_at)}
                      </time>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {featuredArticle.reading_time_minutes} min
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        N
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Notably Team</div>
                        <div className="text-sm text-gray-500">Content Editor</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-6 border-b border-gray-200">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-3 font-medium transition-colors relative ${
                      selectedCategory === null
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Alle
                    {selectedCategory === null && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                    )}
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-3 font-medium transition-colors relative ${
                        selectedCategory === category.id
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {category.name}
                      {selectedCategory === category.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                      )}
                    </button>
                  ))}

                  <div className="ml-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Søk i artikler"
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/artikler/${article.slug}`}
                    className="group block"
                  >
                    {article.media_library && (
                      <div className="mb-4">
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                          <img
                            src={article.media_library.public_url}
                            alt={article.media_library.alt_text}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {article.article_categories && (
                        <span className="inline-block text-sm font-medium text-gray-500">
                          {article.article_categories.name}
                        </span>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-sm text-gray-500 pt-1">
                        <time dateTime={article.published_at}>
                          {formatDate(article.published_at)}
                        </time>
                        <span>•</span>
                        <span>{article.reading_time_minutes} min</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
