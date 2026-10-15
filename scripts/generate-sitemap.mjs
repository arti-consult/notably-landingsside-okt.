import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadArticles } from './articles-lib.mjs';

const ENV_FILES = ['.env', '.env.local', '.env.production', '.env.production.local'];

function parseEnvFile(content) {
  const env = {};
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) {
      env[key] = value;
    }
  }

  return env;
}

async function loadLocalEnv() {
  const merged = {};

  for (const filename of ENV_FILES) {
    try {
      const filePath = resolve(process.cwd(), filename);
      const content = await readFile(filePath, 'utf8');
      Object.assign(merged, parseEnvFile(content));
    } catch {
      // Ignore missing env files.
    }
  }

  return merged;
}

function normalizeBaseUrl(value) {
  if (!value) return 'https://notably.no';
  const withProtocol = value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `https://${value}`;
  return withProtocol.replace(/\/+$/, '');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildAbsoluteUrl(baseUrl, path) {
  if (path === '/') return `${baseUrl}/`;
  return `${baseUrl}${path}`;
}

function toUrl(loc, lastmod) {
  const parts = [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
  ];
  if (lastmod) {
    parts.push(`    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`);
  }
  parts.push('  </url>');
  return parts.join('\n');
}

function articleEntriesFromFiles() {
  return loadArticles().map(article => ({ slug: article.slug, lastmod: article.updated || article.published }));
}

async function generate() {
  const localEnv = await loadLocalEnv();

  const baseUrl = normalizeBaseUrl(
    process.env.SITEMAP_BASE_URL ||
      process.env.SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
      localEnv.SITEMAP_BASE_URL ||
      localEnv.SITE_URL ||
      'https://notably.no'
  );

  const buildDate = new Date().toISOString();
  const staticPaths = [
    '/',
    '/advokat',
    '/regnskapsforer',
    '/bygg-og-anlegg',
    '/om-oss',
    '/artikler',
    '/personvern',
    '/vilkar',
    '/llms.txt',
    '/llms-full.txt',
    '/llms/notably-overview.md',
    '/llms/notably-product.md',
    '/llms/notably-security-personvern.md',
    '/llms/notably-pricing.md',
    '/llms/notably-use-cases.md',
  ];

  const staticEntries = staticPaths.map(path => ({
    loc: buildAbsoluteUrl(baseUrl, path),
    lastmod: buildDate,
  }));

  const articleEntries = articleEntriesFromFiles().map(article => ({
    loc: buildAbsoluteUrl(baseUrl, `/artikler/${article.slug}`),
    lastmod: article.lastmod,
  }));

  const uniqueEntries = new Map();
  for (const entry of [...staticEntries, ...articleEntries]) {
    if (!uniqueEntries.has(entry.loc)) {
      uniqueEntries.set(entry.loc, entry);
    }
  }

  const allEntries = Array.from(uniqueEntries.values());
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allEntries.map(entry => toUrl(entry.loc, entry.lastmod)),
    '</urlset>',
    '',
  ].join('\n');

  const outFile = process.env.SITEMAP_OUT || 'public/sitemap.xml';
  await writeFile(outFile, body, 'utf8');
  console.log(`[sitemap] Wrote sitemap.xml with ${allEntries.length} URLs`);
}

generate().catch((error) => {
  console.error('[sitemap] Failed:', error);
  process.exitCode = 1;
});
