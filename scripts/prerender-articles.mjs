// Statisk HTML for /artikler og hver artikkel, generert etter `vite build`.
// Hver side får riktig <title>, meta description, canonical, Open Graph, Twitter og
// JSON-LD Article i <head>, og artikkelteksten som ferdig HTML i #root, slik at
// søkemotorer og AI-crawlere ser innholdet uten å kjøre JavaScript. React tar over
// siden i nettleseren som før.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  DEFAULT_SOCIAL_IMAGE_URL,
  SITE_URL,
  absoluteUrl,
  articleJsonLd,
  articleUrl,
  escapeHtml,
  loadArticles,
} from './articles-lib.mjs';
import {
  BYGG_DESCRIPTION,
  BYGG_H1,
  BYGG_INTRO,
  BYGG_PATH,
  BYGG_SOCIAL_TITLE,
  BYGG_TITLE,
  byggOutline,
  byggStructuredData,
} from '../src/components/bygg/seo.ts';
import { byggFaqs } from '../src/components/bygg/faqs.ts';

const ROBOTS = 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1';
const LIST_TITLE = 'Artikler - Notably';
const LIST_DESCRIPTION = 'Les artikler om møtereferat, AI-transkripsjon, produktivitet og mer fra Notably.';

// Holdes lik Helmet-taggene i src/pages/BackePage.tsx.
const BACKE = {
  title: 'Kom i gang med Notably | Backe',
  heading: 'Kom i gang med Notably',
  description: 'Slik logger du inn i Notably med Backe-brukeren din og kobler til kalenderen.',
  image: '/media/backe/backe-deling.jpg',
  imageAlt: 'Notably og Backe: Kom i gang med Notably',
};

// Tagger i index.html som erstattes per side.
const REPLACED_HEAD_TAGS = [
  /\s*<title>[\s\S]*?<\/title>/g,
  /\s*<meta\s+name="(?:description|keywords|robots)"[^>]*>/g,
  /\s*<link\s+rel="canonical"[^>]*>/g,
  /\s*<meta\s+property="og:[^"]*"[^>]*>/g,
  /\s*<meta\s+name="twitter:[^"]*"[^>]*>/g,
  /\s*<!--\s*(?:Open Graph[^>]*|Twitter)\s*-->/g,
];

function tag(name, attrs) {
  const parts = Object.entries(attrs).map(([k, v]) => `${k}="${escapeHtml(v)}"`);
  // data-rh gjør at react-helmet-async erstatter taggene i stedet for å duplisere dem.
  return `<${name} data-rh="true" ${parts.join(' ')} />`;
}

function headTags({ title, socialTitle = title, description, canonical, type, image, imageAlt, extraMeta = [], jsonLd, robots = ROBOTS }) {
  const lines = [
    `<title>${escapeHtml(title)}</title>`,
    tag('meta', { name: 'description', content: description }),
    tag('meta', { name: 'robots', content: robots }),
    tag('link', { rel: 'canonical', href: canonical }),
    tag('meta', { property: 'og:type', content: type }),
    tag('meta', { property: 'og:site_name', content: 'Notably' }),
    tag('meta', { property: 'og:locale', content: 'nb_NO' }),
    tag('meta', { property: 'og:title', content: socialTitle }),
    tag('meta', { property: 'og:description', content: description }),
    tag('meta', { property: 'og:url', content: canonical }),
    tag('meta', { property: 'og:image', content: image }),
    tag('meta', { property: 'og:image:alt', content: imageAlt }),
    ...extraMeta,
    tag('meta', { name: 'twitter:card', content: 'summary_large_image' }),
    tag('meta', { name: 'twitter:url', content: canonical }),
    tag('meta', { name: 'twitter:title', content: socialTitle }),
    tag('meta', { name: 'twitter:description', content: description }),
    tag('meta', { name: 'twitter:image', content: image }),
    tag('meta', { name: 'twitter:image:alt', content: imageAlt }),
  ];
  if (jsonLd) {
    lines.push(
      `<script data-rh="true" type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`
    );
  }
  return lines.map((line) => `    ${line}`).join('\n');
}

export function renderPage(template, { head, body }) {
  let html = template;
  for (const pattern of REPLACED_HEAD_TAGS) html = html.replace(pattern, '');
  if (!html.includes('<div id="root"></div>')) throw new Error('[prerender] fant ikke <div id="root"></div> i index.html');
  // Den generelle <noscript>-teksten (med egen H1) erstattes av sideinnholdet i #root.
  html = html.replace(/\s*<noscript>[\s\S]*?<\/noscript>/g, '');
  html = html.replace('</head>', `${head}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Oslo' });

export function articleBody(article) {
  const faq = article.faq.length
    ? `<section class="mt-16 pt-8 border-t border-gray-200"><h2 class="text-3xl font-bold text-gray-900 mb-8">Ofte stilte spørsmål</h2>${article.faq
        .map((item) => `<div class="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6"><h3 class="text-xl font-semibold text-gray-900 mb-3">${escapeHtml(item.question)}</h3><p class="text-gray-700 leading-relaxed">${escapeHtml(item.answer)}</p></div>`)
        .join('')}</section>`
    : '';
  const tags = article.tags.length
    ? `<ul class="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-2">${article.tags.map((t) => `<li class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">${escapeHtml(t)}</li>`).join('')}</ul>`
    : '';
  return [
    '<article class="min-h-screen bg-white pt-20" data-prerendered="artikkel">',
    '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="lg:w-3/4">',
    `<nav class="flex items-center gap-2 text-sm text-gray-600 mb-8" aria-label="Brødsmuler"><a href="/">Hjem</a> › <a href="/artikler">Artikler</a>${article.category ? ` › <span>${escapeHtml(article.category.name)}</span>` : ''}</nav>`,
    '<header class="mb-8">',
    article.category ? `<p class="mb-4 text-sm font-medium text-blue-600">${escapeHtml(article.category.name)}</p>` : '',
    `<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">${escapeHtml(article.title)}</h1>`,
    `<p class="text-sm text-gray-600">Publisert av ${escapeHtml(article.author.name)} · <time datetime="${article.published}">${formatDate(article.published)}</time> · ${article.readingTime} min lesing</p>`,
    '</header>',
    article.image
      ? `<img src="${escapeHtml(article.image.src)}" alt="${escapeHtml(article.image.alt)}" class="max-w-3xl w-full h-auto rounded-xl shadow-lg mb-8" />`
      : '',
    article.tldr
      ? `<div class="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg"><h2 class="text-sm font-bold text-blue-900 uppercase mb-2">TLDR</h2><p class="text-gray-800">${escapeHtml(article.tldr)}</p></div>`
      : '',
    `<div class="article-content">${article.html}</div>`,
    faq,
    tags,
    '</div></div></article>',
  ].join('');
}

export function listBody(articles) {
  const items = articles
    .map(
      (a) =>
        `<li class="mb-8"><a href="/artikler/${a.slug}" class="block"><h2 class="text-xl font-bold text-gray-900">${escapeHtml(a.title)}</h2></a>` +
        `<p class="text-gray-600 text-sm">${escapeHtml(a.excerpt || a.description)}</p>` +
        `<p class="text-sm text-gray-500"><time datetime="${a.published}">${formatDate(a.published)}</time> · ${a.readingTime} min · Av ${escapeHtml(a.author.name)}</p></li>`
    )
    .join('');
  return `<main class="min-h-screen bg-gray-50 pt-20" data-prerendered="artikkelliste"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><h1 class="text-3xl font-bold text-gray-900 mb-8">Artikler</h1><ul>${items}</ul></div></main>`;
}

export function prerenderArticles({ root = process.cwd(), outDir = 'dist', now = new Date() } = {}) {
  const dist = resolve(root, outDir);
  const template = readFileSync(join(dist, 'index.html'), 'utf8');
  const articles = loadArticles({ root, now });
  const written = [];

  const write = (path, html) => {
    const dir = join(dist, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html, 'utf8');
    written.push(`/${path}`);
  };

  // Ukjente /artikler/<slug> får Vercels 404-side, som da er selve appen (viser «Siden ble ikke funnet»).
  writeFileSync(join(dist, '404.html'), template, 'utf8');

  write(
    'artikler',
    renderPage(template, {
      head: headTags({
        title: LIST_TITLE,
        description: LIST_DESCRIPTION,
        canonical: `${SITE_URL}/artikler`,
        type: 'website',
        image: DEFAULT_SOCIAL_IMAGE_URL,
        imageAlt: 'Notably: Møtereferatet skriver seg selv',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: LIST_TITLE,
          url: `${SITE_URL}/artikler`,
          inLanguage: 'nb',
          hasPart: articles.map((a) => ({ '@type': 'Article', headline: a.title, url: articleUrl(a.slug) })),
        },
      }),
      body: listBody(articles),
    })
  );

  for (const article of articles) {
    const canonical = articleUrl(article.slug);
    write(
      `artikler/${article.slug}`,
      renderPage(template, {
        head: headTags({
          title: article.seoTitle,
          description: article.description,
          canonical,
          type: 'article',
          image: absoluteUrl(article.image?.src) || DEFAULT_SOCIAL_IMAGE_URL,
          imageAlt: article.image?.alt || 'Notably: Møtereferatet skriver seg selv',
          extraMeta: [
            tag('meta', { property: 'article:published_time', content: article.published }),
            tag('meta', { property: 'article:modified_time', content: article.updated }),
            tag('meta', { property: 'article:author', content: article.author.name }),
            ...(article.category ? [tag('meta', { property: 'article:section', content: article.category.name })] : []),
            ...article.tags.map((t) => tag('meta', { property: 'article:tag', content: t })),
          ],
          jsonLd: articleJsonLd(article),
        }),
        body: articleBody(article),
      })
    );
  }
  // /backe: kundeside for Backe. Ikke indeksert, men Teams, Slack og LinkedIn kjører ikke
  // JavaScript, så delingsbildet og tittelen må stå i den statiske HTML-en.
  write(
    'backe',
    renderPage(template, {
      head: headTags({
        title: BACKE.title,
        description: BACKE.description,
        canonical: `${SITE_URL}/backe`,
        type: 'website',
        image: `${SITE_URL}${BACKE.image}`,
        imageAlt: BACKE.imageAlt,
        robots: 'noindex,nofollow',
      }),
      body: `<main class="min-h-screen bg-[#f5f6f8] pt-32"><div class="page-container"><h1 class="text-4xl font-semibold">${escapeHtml(BACKE.heading)}</h1><p class="mt-5 text-lg text-slate-600">${escapeHtml(BACKE.description)}</p></div></main>`,
    })
  );

  // /bygg-og-anlegg: bransjeside som skal rangere. Uten denne får crawlere som ikke kjører
  // JavaScript forsidens tittel og canonical. Innholdet kommer fra src/components/bygg/seo.ts.
  const byggUrl = `${SITE_URL}${BYGG_PATH}`;
  write(
    BYGG_PATH.slice(1),
    renderPage(template, {
      head: headTags({
        title: BYGG_TITLE,
        socialTitle: BYGG_SOCIAL_TITLE,
        description: BYGG_DESCRIPTION,
        canonical: byggUrl,
        type: 'website',
        image: DEFAULT_SOCIAL_IMAGE_URL,
        imageAlt: 'Notably: Møtereferatet skriver seg selv',
        jsonLd: byggStructuredData(SITE_URL),
      }),
      body: byggBody(),
    })
  );

  return written;
}

const SIGNUP_URL = 'https://app.notably.no/no/sign-up';
const DEMO_URL = 'https://os.notably.no/book/demo';

export function byggBody() {
  const sections = byggOutline
    .map(({ heading, text }) => `<section class="mt-14"><h2 class="text-3xl font-semibold text-slate-800">${escapeHtml(heading)}</h2><p class="mt-4 text-lg text-slate-600">${escapeHtml(text)}</p></section>`)
    .join('');
  const faq = byggFaqs
    .map(({ question, answer }) => `<div class="mt-6"><h3 class="text-xl font-semibold text-slate-900">${escapeHtml(question)}</h3><p class="mt-2 text-slate-600">${escapeHtml(answer)}</p></div>`)
    .join('');
  return [
    '<main class="min-h-screen bg-white pt-32" data-prerendered="bygg-og-anlegg"><div class="page-container">',
    `<h1 class="text-5xl font-semibold text-slate-800">${escapeHtml(BYGG_H1)}</h1>`,
    `<p class="mt-6 max-w-md text-xl text-slate-600">${escapeHtml(BYGG_INTRO)}</p>`,
    `<p class="mt-8"><a href="${SIGNUP_URL}">Prøv gratis i 14 dager</a> · <a href="${DEMO_URL}">Book demo for firmaet</a></p>`,
    sections,
    `<section class="mt-14"><h2 class="text-3xl font-semibold text-slate-800">Ofte stilte spørsmål</h2>${faq}</section>`,
    '<p class="mt-14"><a href="/">Notably</a> · <a href="/advokat">For advokater</a> · <a href="/regnskapsforer">For regnskapsførere</a> · <a href="/personvern">Personvern</a></p>',
    '</div></main>',
  ].join('');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const written = prerenderArticles();
  console.log(`[prerender] Skrev ${written.length} sider: ${written.join(', ')}`);
}
