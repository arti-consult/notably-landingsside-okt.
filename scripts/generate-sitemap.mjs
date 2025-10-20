import { writeFile } from 'node:fs/promises';

const BASE_URL = process.env.SITEMAP_BASE_URL || 'https://notably.no';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function fetchArticleSlugs() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const nowIso = new Date().toISOString();
    const url = new URL('/rest/v1/articles', SUPABASE_URL);
    url.searchParams.set('select', 'slug,updated_at,published_at');
    url.searchParams.set('status', 'eq.published');
    url.searchParams.set('published_at', `lte.${nowIso}`);
    url.searchParams.set('order', 'published_at.desc');

    const res = await fetch(url.toString(), {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res.ok) throw new Error(`Supabase REST failed: ${res.status}`);
    const rows = await res.json();
    return rows
      .filter(r => r.slug)
      .map(r => ({ slug: r.slug, lastmod: r.updated_at || r.published_at || null }));
  } catch (e) {
    console.warn('[sitemap] Could not fetch articles:', e.message);
    return [];
  }
}

function toUrl(loc, lastmod) {
  const parts = [
    '  <url>',
    `    <loc>${loc}</loc>`,
  ];
  if (lastmod) parts.push(`    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`);
  parts.push('  </url>');
  return parts.join('\n');
}

async function generate() {
  const staticUrls = [
    `${BASE_URL}/`,
    `${BASE_URL}/artikler`,
  ];

  const articles = await fetchArticleSlugs();

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls.map(u => toUrl(u)),
    ...articles.map(a => toUrl(`${BASE_URL}/artikler/${a.slug}`, a.lastmod)),
    '</urlset>',
    '',
  ].join('\n');

  await writeFile('public/sitemap.xml', body, 'utf8');
  console.log(`[sitemap] Wrote sitemap.xml with ${staticUrls.length + articles.length} URLs`);
}

generate().catch(err => {
  console.error('[sitemap] Failed:', err);
  process.exitCode = 1;
});

