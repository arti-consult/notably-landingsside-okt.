// Leser artikler fra content/artikler/*.md ved byggetid.
// Brukes av Vite-pluginen (virtual:articles), prerender og sitemap-generatoren.
// Formatet er dokumentert i content/artikler/README.md.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { marked } from 'marked';

export const SITE_URL = 'https://notably.no';
export const ARTICLES_DIR = 'content/artikler';
export const DEFAULT_AUTHOR = 'Notably Team';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'o')
    .replace(/[å]/g, 'a')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', shy: '\u00ad' };

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

export function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ''));
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Gir h2/h3 i brødteksten id-er (heading-<n>-<slug>, samme algoritme som den gamle
 * editoren) og returnerer innholdsfortegnelsen. Overskrifter inne i CTA-bokser telles ikke.
 */
export function addHeadingIds(html) {
  const toc = [];
  const out = html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/g, (match, tag, attrs, inner) => {
    if (/notably-inline-cta__title/.test(attrs)) return match;
    const text = stripTags(inner);
    const id = `heading-${toc.length}-${generateSlug(text)}`;
    toc.push({ id, text, level: Number(tag[1]) });
    const cleanAttrs = attrs.replace(/\s+id="[^"]*"/, '');
    return `<${tag} id="${id}"${cleanAttrs}>${inner}</${tag}>`;
  });
  return { html: out, toc };
}

export function readingTimeMinutes(html) {
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function fail(file, message) {
  throw new Error(`[artikler] ${file}: ${message}`);
}

function toIso(value, file, field) {
  if (value === undefined || value === null || value === '') return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) fail(file, `ugyldig dato i «${field}»`);
  return date.toISOString();
}

export function parseArticleFile(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) fail(file, 'mangler frontmatter (--- ... ---)');
  const data = parseYaml(match[1]) || {};
  const body = match[2].trim();
  const fileSlug = file.replace(/^.*\//, '').replace(/\.md$/, '');

  for (const field of ['title', 'description', 'published']) {
    if (!data[field]) fail(file, `mangler påkrevd felt «${field}»`);
  }
  const slug = data.slug || fileSlug;
  if (slug !== fileSlug) fail(file, `slug «${slug}» må være lik filnavnet «${fileSlug}»`);
  if (!SLUG_RE.test(slug)) fail(file, `slug «${slug}» kan bare inneholde a-z, 0-9 og bindestrek`);
  if (!body) fail(file, 'brødteksten er tom');

  const format = data.format || 'markdown';
  if (!['markdown', 'html'].includes(format)) fail(file, `format må være «markdown» eller «html»`);
  const rawHtml = format === 'html' ? body : marked.parse(body, { async: false, gfm: true });
  const { html, toc } = addHeadingIds(rawHtml);

  const image = data.image?.src ? { src: data.image.src, alt: data.image.alt || data.title } : null;
  if (image && !/^\/artikler\//.test(image.src) && !/^https:\/\//.test(image.src)) {
    fail(file, 'image.src må starte med /artikler/ (lokal fil i public/) eller https://');
  }

  const faq = Array.isArray(data.faq)
    ? data.faq.map((item, i) => {
        if (!item?.question || !item?.answer) fail(file, `faq[${i}] mangler question/answer`);
        return { question: String(item.question), answer: String(item.answer) };
      })
    : [];

  const published = toIso(data.published, file, 'published');
  return {
    slug,
    title: String(data.title),
    seoTitle: String(data.seoTitle || data.title),
    description: String(data.description),
    excerpt: data.excerpt ? String(data.excerpt) : '',
    tldr: data.tldr ? String(data.tldr) : '',
    published,
    updated: toIso(data.updated, file, 'updated') || published,
    author: {
      name: (data.author?.name && String(data.author.name).trim()) || DEFAULT_AUTHOR,
      image: data.author?.image || null,
    },
    category: data.category?.name
      ? { name: String(data.category.name), slug: String(data.category.slug || generateSlug(String(data.category.name))) }
      : null,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    image,
    readingTime: Number(data.readingTime) || readingTimeMinutes(html),
    draft: data.draft === true,
    faq,
    toc,
    html,
  };
}

/**
 * Alle publiserte artikler, nyeste først. Utkast (draft: true) og artikler med
 * publiseringsdato fram i tid tas ikke med.
 */
export function loadArticles({ root = process.cwd(), now = new Date(), includeUnpublished = false } = {}) {
  const dir = resolve(root, ARTICLES_DIR);
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((name) => name.endsWith('.md') && name.toLowerCase() !== 'readme.md');
  const articles = files.map((name) => parseArticleFile(readFileSync(join(dir, name), 'utf8'), `${ARTICLES_DIR}/${name}`));

  if (!includeUnpublished) {
    for (const article of articles) {
      if (article.image && article.image.src.startsWith('/')) {
        const local = resolve(root, 'public', `.${article.image.src}`);
        if (!existsSync(local)) fail(`${ARTICLES_DIR}/${article.slug}.md`, `bildet ${article.image.src} finnes ikke i public/`);
      }
    }
  }

  return articles
    .filter((a) => includeUnpublished || (!a.draft && new Date(a.published) <= now))
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function summarize(article) {
  const summary = { ...article };
  delete summary.html;
  delete summary.faq;
  delete summary.toc;
  return summary;
}

export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;
}

export function articleUrl(slug) {
  return `${SITE_URL}/artikler/${slug}`;
}

export const DEFAULT_SOCIAL_IMAGE_URL =
  'https://notably.no/media/1771692827041.png';

export function articleJsonLd(article) {
  const image = absoluteUrl(article.image?.src) || DEFAULT_SOCIAL_IMAGE_URL;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: [image],
    datePublished: article.published,
    dateModified: article.updated,
    author: { '@type': 'Person', name: article.author.name },
    publisher: {
      '@type': 'Organization',
      name: 'Notably',
      logo: { '@type': 'ImageObject', url: DEFAULT_SOCIAL_IMAGE_URL },
    },
    mainEntityOfPage: articleUrl(article.slug),
    inLanguage: 'nb',
    ...(article.category ? { articleSection: article.category.name } : {}),
    ...(article.tags.length ? { keywords: article.tags.join(', ') } : {}),
  };
}
