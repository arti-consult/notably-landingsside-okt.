import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function normalizeBaseUrl(value) {
  const fallback = 'https://notably.no';
  if (!value) return fallback;
  const withProtocol = value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `https://${value}`;
  return withProtocol.replace(/\/+$/, '');
}

function parseSitemapUrls(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map(match => match[1]).filter(Boolean);
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function readSitemapUrls() {
  try {
    const xml = await readFile(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');
    return parseSitemapUrls(xml);
  } catch (error) {
    console.warn('[indexing] Could not read sitemap.xml:', error.message);
    return [];
  }
}

async function pingBing(sitemapUrl) {
  const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    const response = await fetch(pingUrl);
    if (!response.ok) {
      console.warn(`[indexing] Bing sitemap ping failed: ${response.status}`);
      return;
    }
    console.log('[indexing] Bing sitemap ping sent.');
  } catch (error) {
    console.warn('[indexing] Could not ping Bing sitemap endpoint:', error.message);
  }
}

async function writeIndexNowKeyFile(indexNowKey) {
  try {
    const distPath = resolve(process.cwd(), 'dist', `${indexNowKey}.txt`);
    await writeFile(distPath, `${indexNowKey}\n`, 'utf8');
  } catch {
    // Ignore if dist does not exist in local script runs.
  }
}

async function submitIndexNow({ baseUrl, host, key, endpoint, urlList }) {
  if (!key) {
    console.log('[indexing] INDEXNOW_KEY is not set. Skipping IndexNow submit.');
    return;
  }

  await writeIndexNowKeyFile(key);
  const keyLocation = `${baseUrl}/${key}.txt`;
  const urlChunks = chunk(urlList, 10000);

  for (const urls of urlChunks) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host,
          key,
          keyLocation,
          urlList: urls,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        console.warn(`[indexing] IndexNow submit failed (${response.status}): ${body}`);
        continue;
      }

      console.log(`[indexing] IndexNow submit sent for ${urls.length} URLs.`);
    } catch (error) {
      console.warn('[indexing] Could not submit IndexNow payload:', error.message);
    }
  }
}

async function run() {
  const baseUrl = normalizeBaseUrl(
    process.env.SITEMAP_BASE_URL ||
      process.env.SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
      'https://notably.no'
  );

  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  const host = process.env.INDEXNOW_HOST || new URL(baseUrl).host;
  const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
  const key = process.env.INDEXNOW_KEY;

  const sitemapUrls = await readSitemapUrls();
  const urlList = sitemapUrls.length > 0 ? sitemapUrls : [`${baseUrl}/`];

  await pingBing(sitemapUrl);
  await submitIndexNow({ baseUrl, host, key, endpoint, urlList });
}

run().catch((error) => {
  console.warn('[indexing] Notify script failed:', error.message);
});
