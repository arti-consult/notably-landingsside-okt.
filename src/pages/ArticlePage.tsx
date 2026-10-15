import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { articles, loadArticleBody, type ArticleBody } from 'virtual:articles';
import { Clock, Calendar, Tag, ChevronRight, Home, Share2, Linkedin, Facebook, Link2 } from 'lucide-react';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL, SITE_NAME, SITE_URL } from '../lib/seo';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import NotFound from './NotFound';

const absolute = (src: string) => (/^https?:\/\//.test(src) ? src : `${SITE_URL}${src}`);

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug) ?? null;
  const [body, setBody] = useState<ArticleBody | null>(null);
  const [activeHeading, setActiveHeading] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    let cancelled = false;
    setBody(null);
    if (slug) {
      loadArticleBody(slug).then((loaded) => {
        if (!cancelled) setBody(loaded);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const relatedArticles = article?.category ? articles.filter((a) => a.slug !== article.slug).slice(0, 3) : [];

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
  }, [body]);

  if (!article) {
    return <NotFound />;
  }

  if (!body) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Laster artikkel...</div>
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

  const canonicalUrl = `${SITE_URL}/artikler/${article.slug}`;
  const metaTitle = article.seoTitle;
  const metaDescription = article.description;
  const ogTitle = metaTitle;
  const ogDescription = metaDescription;
  const ogImage = article.image ? absolute(article.image.src) : DEFAULT_SOCIAL_IMAGE_URL;
  const ogImageAlt = article.image?.alt || DEFAULT_SOCIAL_IMAGE_ALT;
  const authorName = article.author.name;
  const authorInitial = authorName.charAt(0).toUpperCase();
  const publishedTime = new Date(article.published).toISOString();
  const modifiedTime = new Date(article.updated).toISOString();
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: metaDescription,
    image: [ogImage],
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_SOCIAL_IMAGE_URL,
      },
    },
    mainEntityOfPage: canonicalUrl,
    inLanguage: 'nb',
    ...(article.category ? { articleSection: article.category.name } : {}),
    ...(article.tags.length ? { keywords: article.tags.join(', ') } : {}),
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(canonicalUrl);
      } else {
        const input = document.createElement('input');
        input.value = canonicalUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }

    window.setTimeout(() => setCopyStatus('idle'), 2200);
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={ogImageAlt} />
        <meta property="article:published_time" content={publishedTime} />
        <meta property="article:modified_time" content={modifiedTime} />
        <meta property="article:author" content={authorName} />
        {article.category?.name && (
          <meta property="article:section" content={article.category.name} />
        )}
        {article.tags.map((tag, idx) => (
          <meta key={`article-tag-${idx}`} property="article:tag" content={tag} />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={ogImageAlt} />

        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
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
              {article.category && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <Link
                    to="/artikler"
                    className="hover:text-gray-900"
                  >
                    {article.category.name}
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
                {article.category && (
                  <Link
                    to="/artikler"
                    className="inline-block mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {article.category.name}
                  </Link>
                )}

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    {article.author.image ? (
                      <img
                        src={article.author.image}
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
                    <time dateTime={article.published}>
                      {formatDate(article.published)}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readingTime} min lesing</span>
                  </div>
                </div>
              </header>

              {article.image && (
                <div className="flex justify-center mb-8">
                  <img
                    src={article.image.src}
                    alt={article.image.alt || article.title}
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
                dangerouslySetInnerHTML={{ __html: body.html }}
              />

              {body.faq.length > 0 && (
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Ofte stilte spørsmål</h2>
                  <div className="space-y-6">
                    {body.faq.map((faqItem, idx) => (
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

              {article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-5 h-5 text-gray-400" />
                    {article.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Share2 className="w-5 h-5 text-gray-500" />
                    <h2 className="text-base font-semibold text-gray-900">Del artikkelen</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={linkedInShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700"
                      aria-label="Del på LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                    <a
                      href={facebookShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700"
                      aria-label="Del på Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700"
                      aria-label="Kopier lenke"
                    >
                      <Link2 className="w-4 h-4" />
                      {copyStatus === 'copied' ? 'Lenke kopiert' : copyStatus === 'error' ? 'Kunne ikke kopiere' : 'Kopier lenke'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {body.toc.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Innholdsfortegnelse</h3>
                    <nav>
                      <ul className="space-y-2">
                        {body.toc.map((item) => (
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
                    key={related.slug}
                    to={`/artikler/${related.slug}`}
                    className="group"
                  >
                    {related.image && (
                      <img
                        src={related.image.src}
                        alt={related.image.alt || related.title}
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
