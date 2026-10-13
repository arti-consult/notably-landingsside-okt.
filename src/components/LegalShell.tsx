import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL } from '../lib/seo';

type LegalShellProps = {
  title: string;
  description: string;
  path: '/personvern' | '/vilkar';
  lastUpdatedLabel: string;
  intro: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function LegalShell({
  title,
  description,
  path,
  lastUpdatedLabel,
  intro,
  children,
  actions,
}: LegalShellProps) {
  const pageTitle = `${title} - Notably`;
  const canonical = `https://notably.no${path}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Notably" />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <meta property="og:image:alt" content={DEFAULT_SOCIAL_IMAGE_ALT} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonical} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <meta name="twitter:image:alt" content={DEFAULT_SOCIAL_IMAGE_ALT} />
      </Helmet>

      <main className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til forsiden
          </Link>

          <h1 className="text-3xl md:text-5xl font-bold mb-8">{title}</h1>
          <p className="text-gray-400 mb-8">{lastUpdatedLabel}</p>
          <article className="prose prose-invert max-w-none text-gray-300 [&_section]:mb-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:text-white [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:text-white [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4 [&_strong]:text-white [&_a]:text-blue-400 [&_a:hover]:text-blue-300 [&_a]:break-words">
            <section>
              <p>{intro}</p>
            </section>
            {children}
          </article>
          {actions}
        </div>
      </main>
    </>
  );
}
