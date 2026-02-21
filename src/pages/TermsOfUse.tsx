import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import termsText from '../content/terms-of-use.txt?raw';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL } from '../lib/seo';

export default function TermsOfUse() {
  const headings = new Set([
    'Vilkår for bruk',
    'Tjenestebeskrivelse',
    'Akseptabel bruk',
    'Konto og tilgang',
    'Datasenter og etterlevelse',
    'Bruk av Google API-er',
    'Fakturering',
    'Sletting av konto',
    'Ansvarsbegrensning',
    'Kontakt',
  ]);

  const lines = termsText.split(/\r?\n/);

  type Block =
    | { type: 'meta'; text: string }
    | { type: 'heading'; text: string }
    | { type: 'paragraph'; text: string }
    | { type: 'list'; items: string[] };

  const blocks: Block[] = [];
  let buffer: string[] = [];
  let listBuffer: string[] | null = null;

  const flushParagraph = () => {
    const text = buffer.join(' ').trim();
    if (text) blocks.push({ type: 'paragraph', text });
    buffer = [];
  };

  const flushList = () => {
    if (listBuffer && listBuffer.length) {
      blocks.push({ type: 'list', items: listBuffer });
    }
    listBuffer = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\u00A0/g, ' ').trim();
    if (!line) {
      // Blank line: end current paragraph or list
      flushParagraph();
      flushList();
      continue;
    }

    if (/^Sist oppdatert:/i.test(line) && blocks.findIndex(b => b.type === 'meta') === -1) {
      // First "Sist oppdatert" becomes meta line
      flushParagraph();
      flushList();
      blocks.push({ type: 'meta', text: line });
      continue;
    }

    if (headings.has(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', text: line });
      continue;
    }

    // Bullet item (e.g., "• text" possibly with tabs)
    if (/^[•\-]/.test(line) || /^•/.test(line) || /^•/.test(line.replace(/^\s+/, ''))) {
      const item = line.replace(/^[-•]\s*/, '').replace(/^•?\s*/, '').trim();
      if (!listBuffer) listBuffer = [];
      if (item) listBuffer.push(item);
      continue;
    }

    // Word export sometimes prefixes bullets with tabs and a bullet between
    if (/^•/.test(rawLine.replace(/[\t ]+/g, '').trim())) {
      const item = rawLine.replace(/[\t ]+/g, ' ').replace(/^\s*•\s*/, '').trim();
      if (!listBuffer) listBuffer = [];
      if (item) listBuffer.push(item);
      continue;
    }

    // Default: paragraph text, accumulate sentences on same block
    buffer.push(line);
  }

  // Flush tail buffers
  flushParagraph();
  flushList();

  return (
    <>
      <Helmet>
        <title>Vilkår for bruk - Notably</title>
        <meta name="description" content="Les våre vilkår for bruk for Notably. Denne siden beskriver rammer for bruk av tjenesten og ansvar mellom partene." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://notably.no/vilkar" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Notably" />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:url" content="https://notably.no/vilkar" />
        <meta property="og:title" content="Vilkår for bruk - Notably" />
        <meta
          property="og:description"
          content="Les våre vilkår for bruk for Notably. Denne siden beskriver rammer for bruk av tjenesten og ansvar mellom partene."
        />
        <meta property="og:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <meta property="og:image:alt" content={DEFAULT_SOCIAL_IMAGE_ALT} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://notably.no/vilkar" />
        <meta name="twitter:title" content="Vilkår for bruk - Notably" />
        <meta
          name="twitter:description"
          content="Les våre vilkår for bruk for Notably. Denne siden beskriver rammer for bruk av tjenesten og ansvar mellom partene."
        />
        <meta name="twitter:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <meta name="twitter:image:alt" content={DEFAULT_SOCIAL_IMAGE_ALT} />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til forsiden
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-8">Vilkår for bruk</h1>

          <div className="prose prose-invert max-w-none">
            {blocks.map((b, i) => {
              if (b.type === 'meta') {
                return (
                  <p key={`meta-${i}`} className="text-gray-400 mb-8">
                    {b.text}
                  </p>
                );
              }
              if (b.type === 'heading') {
                return (
                  <h2 key={`h-${i}`} className="text-2xl font-semibold mb-4">
                    {b.text}
                  </h2>
                );
              }
              if (b.type === 'list') {
                return (
                  <ul key={`ul-${i}`} className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                    {b.items.map((it, j) => (
                      <li key={`li-${i}-${j}`}>{it}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={`p-${i}`} className="text-gray-300 mb-6">
                  {b.text}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
