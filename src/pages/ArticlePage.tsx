import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Clock, Calendar, Tag, ChevronRight, Home } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  tldr: string | null;
  faq_json: Array<{ question: string; answer: string }> | null;
  published_at: string;
  reading_time_minutes: number;
  view_count: number;
  author_name: string | null;
  author_profile_picture_url: string | null;
  article_categories: { name: string; slug: string } | null;
  article_tags: Array<{ tag: string }>;
  article_seo_metadata: {
    meta_title: string | null;
    meta_description: string | null;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    schema_json: any;
  } | null;
  article_table_of_contents: {
    toc_json: Array<{ id: string; text: string; level: number }>;
  } | null;
  media_library: {
    public_url: string;
    alt_text: string;
  } | null;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHeading, setActiveHeading] = useState('');

  useEffect(() => {
    if (slug) {
      loadArticle();
      trackView();
    }
  }, [slug]);

  const loadArticle = async () => {
    const { data } = await supabase
      .from('articles')
      .select(`
        *,
        article_categories (name, slug),
        article_tags (tag),
        article_seo_metadata (*),
        article_table_of_contents (*),
        media_library (public_url, alt_text)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (data) {
      setArticle(data as Article);
      loadRelatedArticles(data.article_categories?.name);
    }

    setLoading(false);
  };

  const loadRelatedArticles = async (categoryName?: string) => {
    if (!categoryName) return;

    const { data } = await supabase
      .from('articles')
      .select(`
        *,
        article_categories (name, slug),
        media_library (public_url, alt_text)
      `)
      .eq('status', 'published')
      .neq('slug', slug)
      .limit(3);

    if (data) {
      setRelatedArticles(data as Article[]);
    }
  };

  const trackView = async () => {
    const { data: article } = await supabase
      .from('articles')
      .select('id, view_count')
      .eq('slug', slug)
      .single();

    if (article) {
      await supabase
        .from('articles')
        .update({ view_count: article.view_count + 1 })
        .eq('id', article.id);
    }
  };

  const processContentWithIds = (content: string) => {
    if (!article?.article_table_of_contents?.toc_json) return content;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');

    article.article_table_of_contents.toc_json.forEach((tocItem) => {
      headings.forEach((heading) => {
        if (heading.textContent?.trim() === tocItem.text.trim()) {
          heading.setAttribute('id', tocItem.id);
        }
      });
    });

    return doc.body.innerHTML;
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHeading(id);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    const headings = document.querySelectorAll('h2[id], h3[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Laster artikkel...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Artikkel ikke funnet</h1>
          <Link to="/artikler" className="text-blue-600 hover:underline">
            Tilbake til artikler
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const canonicalUrl = `https://notably.no/artikler/${article.slug}`;
  const metaTitle = article.article_seo_metadata?.meta_title || article.title;
  const metaDescription = article.article_seo_metadata?.meta_description || article.excerpt || '';
  const ogImage = article.article_seo_metadata?.og_image || article.media_library?.public_url || '';
  const authorName = article.author_name?.trim() || 'Notably Team';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:title" content={article.article_seo_metadata?.og_title || metaTitle} />
        <meta property="og:description" content={article.article_seo_metadata?.og_description || metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        {ogImage && <meta property="og:image" content={ogImage} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        {article.article_seo_metadata?.schema_json && (
          <script type="application/ld+json">
            {JSON.stringify(article.article_seo_metadata.schema_json)}
          </script>
        )}
      </Helmet>

      <Navigation />

      <article className="min-h-screen bg-white">
        <div className="bg-gray-50 border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-gray-900 flex items-center gap-1">
                <Home className="w-4 h-4" />
                Hjem
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/artikler" className="hover:text-gray-900">
                Artikler
              </Link>
              {article.article_categories && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <Link
                    to={`/artikler/category/${article.article_categories.slug}`}
                    className="hover:text-gray-900"
                  >
                    {article.article_categories.name}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              <header className="mb-8">
                {article.article_categories && (
                  <Link
                    to={`/artikler/category/${article.article_categories.slug}`}
                    className="inline-block mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {article.article_categories.name}
                  </Link>
                )}

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    {article.author_profile_picture_url ? (
                      <img
                        src={article.author_profile_picture_url}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                        {authorInitial}
                      </div>
                    )}
                    <div className="leading-tight">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Publisert av</p>
                      <p className="text-sm font-medium text-gray-900">{authorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={article.published_at}>
                      {formatDate(article.published_at)}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.reading_time_minutes} min lesing</span>
                  </div>
                </div>
              </header>

              {article.media_library && (
                <div className="flex justify-center mb-8">
                  <img
                    src={article.media_library.public_url}
                    alt={article.media_library.alt_text}
                    className="max-w-3xl w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
              )}

              {article.tldr && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
                  <h2 className="text-sm font-bold text-blue-900 uppercase mb-2">TLDR</h2>
                  <p className="text-gray-800">{article.tldr}</p>
                </div>
              )}

              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: processContentWithIds(article.content) }}
              />

              {article.faq_json && article.faq_json.length > 0 && (
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Ofte stilte spørsmål</h2>
                  <div className="space-y-6">
                    {article.faq_json.map((faqItem, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {faqItem.question}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {faqItem.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {article.article_tags && article.article_tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-5 h-5 text-gray-400" />
                    {article.article_tags.map((tagObj, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                      >
                        {tagObj.tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {article.article_table_of_contents && article.article_table_of_contents.toc_json.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Innholdsfortegnelse</h3>
                    <nav>
                      <ul className="space-y-2">
                        {article.article_table_of_contents.toc_json.map((item) => (
                          <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 16}px` }}>
                            <button
                              onClick={() => scrollToHeading(item.id)}
                              className={`text-sm text-left hover:text-blue-600 transition-colors ${
                                activeHeading === item.id ? 'text-blue-600 font-medium' : 'text-gray-600'
                              }`}
                            >
                              {item.text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-16 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Relaterte artikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`/artikler/${related.slug}`}
                    className="group"
                  >
                    {related.media_library && (
                      <img
                        src={related.media_library.public_url}
                        alt={related.media_library.alt_text}
                        className="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {related.title}
                    </h3>
                    {related.excerpt && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {related.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </>
  );
}
