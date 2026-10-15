// Artikler fra filer: innlesing, statisk HTML (prerender), sitemap og at
// ingen kode lenger leser artikler fra den gamle Bolt-databasen.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { loadArticles, parseArticleFile } from '../scripts/articles-lib.mjs';
import { prerenderArticles } from '../scripts/prerender-articles.mjs';

const root = resolve(import.meta.dirname, '..');

const EXPECTED = {
  'microsoft-copilot-vs-notably-for-motenotater-en-sammenligning': {
    h1: 'Microsoft Copilot vs Notably for møtenotater: En sammenligning',
    title: 'Notably vs Microsoft Copilot for møtenotater og referater: En praktisk sammenligning',
    description: 'Sammenlign Microsoft Copilot og Notably for møtenotater. Finn ut hvilken løsning som gir best struktur, personvern og tilpasning for norske virksomheter!',
  },
  'pharma-nordic-notably-frigjor-tid-fra-forste-mote': {
    h1: 'Pharma Nordic: – Notably frigjør tid fra første møte',
    title: 'Pharma Nordic effektiviserer møtene med Notably – fra refera',
    description: 'Pharma Nordic bruker AI-assistenten Notably for å automatisere møtereferater og oppfølging. Resultatet er raskere prosesser, bedre struktur og mer tid til strat',
  },
  'notably-norsk-spesialist-vs-internasjonale-konkurrenter-innen-ai-motereferat': {
    h1: 'Notably: Norsk spesialist vs. internasjonale konkurrenter innen AI-møtereferat',
    title: 'Notably: Norsk AI-løsning for møtereferat og transkripsjon',
    description: 'Oppdag hvordan Notably skiller seg ut i AI-møtereferat med norsk språkstøtte og lokal tilpasning mot internasjonale konkurrenter. Les mer nå!',
  },
};

const attr = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildInto() {
  const out = mkdtempSync(join(tmpdir(), 'artikler-prerender-'));
  writeFileSync(join(out, 'index.html'), readFileSync(join(root, 'index.html'), 'utf8'));
  const written = prerenderArticles({ root, outDir: out });
  return { out, written };
}

test('alle tre publiserte artikler leses fra content/artikler', () => {
  const articles = loadArticles({ root });
  assert.deepEqual(articles.map((a) => a.slug).sort(), Object.keys(EXPECTED).sort());
  for (const article of articles) {
    assert.ok(article.html.length > 2000, `${article.slug} har brødtekst`);
    assert.ok(article.image && existsSync(join(root, 'public', article.image.src)), `${article.slug} har lokalt forsidebilde`);
    assert.ok(article.toc.length > 0, `${article.slug} har innholdsfortegnelse`);
    for (const item of article.toc) assert.ok(article.html.includes(`id="${item.id}"`));
    assert.doesNotMatch(article.html, /qelklrrxciwomrwunzjo/, `${article.slug} peker ikke på Bolt-lagring`);
  }
});

test('statisk HTML for hver artikkel har riktig title, meta, canonical, OG og JSON-LD', () => {
  const { out, written } = buildInto();
  assert.ok(written.includes('/artikler'));
  for (const [slug, expected] of Object.entries(EXPECTED)) {
    const file = join(out, 'artikler', slug, 'index.html');
    const html = readFileSync(file, 'utf8');
    const url = `https://notably.no/artikler/${slug}`;
    assert.equal((html.match(/<title>/g) || []).length, 1, 'nøyaktig én <title>');
    assert.ok(html.includes(`<title>${expected.title.replace(/&/g, '&amp;')}</title>`), `title for ${slug}`);
    assert.ok(html.includes(`name="description" content="${attr(expected.description)}"`), `description for ${slug}`);
    assert.equal((html.match(/name="description"/g) || []).length, 1, 'nøyaktig én description');
    assert.ok(html.includes(`<link data-rh="true" rel="canonical" href="${url}" />`), `canonical for ${slug}`);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, 'nøyaktig én canonical');
    assert.ok(html.includes(`property="og:url" content="${url}"`));
    assert.ok(html.includes('property="og:type" content="article"'));
    assert.match(html, new RegExp(`property="og:image" content="https://notably.no/artikler/${slug}/`));
    const ld = [...html.matchAll(/<script data-rh="true" type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const article = ld.find((item) => item['@type'] === 'Article');
    assert.ok(article, 'JSON-LD Article finnes');
    assert.equal(article.headline, expected.h1);
    assert.equal(article.mainEntityOfPage, url);
    assert.ok(html.includes(`<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">${expected.h1}</h1>`), 'h1 i statisk HTML');
    assert.match(html, /<div class="article-content"><(p|h2)/, 'brødtekst i statisk HTML');
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'nøyaktig én H1');
  }
  const list = readFileSync(join(out, 'artikler', 'index.html'), 'utf8');
  assert.ok(list.includes('<title>Artikler - Notably</title>'));
  assert.ok(list.includes('rel="canonical" href="https://notably.no/artikler"'));
  for (const slug of Object.keys(EXPECTED)) assert.ok(list.includes(`href="/artikler/${slug}"`), `listen lenker til ${slug}`);
});

test('sitemap-generatoren leser artiklene fra filer', () => {
  const out = join(mkdtempSync(join(tmpdir(), 'artikler-sitemap-')), 'sitemap.xml');
  execFileSync(process.execPath, ['scripts/generate-sitemap.mjs'], {
    cwd: root,
    env: { ...process.env, SITEMAP_OUT: out, SITEMAP_BASE_URL: 'https://notably.no' },
    stdio: 'pipe',
  });
  const xml = readFileSync(out, 'utf8');
  for (const slug of Object.keys(EXPECTED)) {
    assert.ok(xml.includes(`<loc>https://notably.no/artikler/${slug}</loc>`), `sitemap har ${slug}`);
  }
  assert.ok(xml.includes('<loc>https://notably.no/artikler</loc>'));
});

test('markdown-artikler bygges, og ugyldige filer stoppes', () => {
  const base = '---\ntitle: "Test"\ndescription: "Beskrivelse"\npublished: "2030-01-01"\n---\n\nHei **verden**\n';
  const parsed = parseArticleFile(base, 'content/artikler/test-artikkel.md');
  assert.equal(parsed.slug, 'test-artikkel');
  assert.match(parsed.html, /<strong>verden<\/strong>/);
  const cta = '<div class="notably-inline-cta" data-notably-cta="true"><h3 class="notably-inline-cta__title">Prøv</h3></div>';
  const withCta = parseArticleFile(base.replace('Hei **verden**', `## Første del\n\n${cta}\n\n### Mer\n\ntekst`), 'content/artikler/test-artikkel.md');
  assert.deepEqual(withCta.toc.map((t) => t.id), ['heading-0-forste-del', 'heading-1-mer']);
  assert.ok(withCta.html.includes(cta), 'CTA-HTML beholdes i Markdown');
  assert.throws(() => parseArticleFile('---\ntitle: "x"\n---\n\ntekst', 'content/artikler/x.md'), /description/);
  assert.throws(() => parseArticleFile(base.replace('title: "Test"', 'title: "Test"\nslug: "annet"'), 'content/artikler/test.md'), /filnavnet/);
});

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (['node_modules', 'dist', '.git'].includes(name)) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

test('ingen tilknytning til Bolt-prosjektet, og admin-sidene er borte', () => {
  const files = ['index.html', 'vite.config.ts', 'vercel.json', 'package.json', ...walk(join(root, 'src')), ...walk(join(root, 'scripts')), ...walk(join(root, 'public'))]
    .map((f) => (f.startsWith('/') ? f : join(root, f)))
    .filter((f) => /\.(m?[jt]sx?|html|json|txt|md|xml|css)$/.test(f));
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /rest\/v1\/articles/, `${file} kaller /rest/v1/articles`);
    assert.doesNotMatch(text, /from\(['"](articles|article_[a-z_]+|admin_users|media_library)['"]\)/, `${file} leser artikkeltabeller`);
    assert.doesNotMatch(text, /qelklrrxciwomrwunzjo|@supabase\/supabase-js|VITE_SUPABASE/, `${file} er knyttet til Bolt-prosjektet`);
  }
  const main = readFileSync(join(root, 'src/main.tsx'), 'utf8');
  assert.doesNotMatch(main, /\/admin/);
  for (const gone of ['supabase', '.bolt', 'src/components/WaitlistSection.tsx', 'src/pages/AdminLogin.tsx', 'src/pages/AdminDashboard.tsx', 'src/pages/ArticleManagement.tsx', 'src/components/ArticleEditor.tsx']) {
    assert.ok(!existsSync(join(root, gone)), `${gone} er fjernet`);
  }
});
