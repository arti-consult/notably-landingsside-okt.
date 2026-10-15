// Vite-plugin som gjør content/artikler/*.md tilgjengelig for appen uten database:
//   import { articles, loadArticleBody } from 'virtual:articles'
// Listen (articles) inneholder bare metadata; brødteksten for hver artikkel ligger i
// en egen chunk som lastes ved behov. Etter `vite build` skrives statisk HTML for
// /artikler og hver artikkel (se prerender-articles.mjs).
import { resolve } from 'node:path';
import { ARTICLES_DIR, loadArticles, summarize } from './articles-lib.mjs';
import { prerenderArticles } from './prerender-articles.mjs';

const LIST_ID = 'virtual:articles';
const BODY_PREFIX = 'virtual:article-body/';

export default function articlesPlugin() {
  let root = process.cwd();
  let outDir = 'dist';
  let isBuild = false;

  return {
    name: 'notably-articles',
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
      isBuild = config.command === 'build';
    },
    resolveId(id) {
      if (id === LIST_ID || id.startsWith(BODY_PREFIX)) return `\0${id}`;
      return null;
    },
    load(id) {
      if (id === `\0${LIST_ID}`) {
        const articles = loadArticles({ root });
        const loaders = articles
          .map((a) => `  ${JSON.stringify(a.slug)}: () => import(${JSON.stringify(BODY_PREFIX + a.slug)}),`)
          .join('\n');
        return [
          `export const articles = ${JSON.stringify(articles.map(summarize))};`,
          `const loaders = {\n${loaders}\n};`,
          'export function loadArticleBody(slug) {',
          '  const load = loaders[slug];',
          '  return load ? load().then((m) => m.default) : Promise.resolve(null);',
          '}',
        ].join('\n');
      }
      if (id.startsWith(`\0${BODY_PREFIX}`)) {
        const slug = id.slice(BODY_PREFIX.length + 1);
        const article = loadArticles({ root }).find((a) => a.slug === slug);
        if (!article) return 'export default null;';
        const { html, faq, toc } = article;
        return `export default ${JSON.stringify({ html, faq, toc })};`;
      }
      return null;
    },
    configureServer(server) {
      const dir = resolve(root, ARTICLES_DIR);
      server.watcher.add(dir);
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(dir)) return;
        for (const mod of server.moduleGraph.idToModuleMap.values()) {
          if (mod.id?.startsWith(`\0${LIST_ID}`) || mod.id?.startsWith(`\0${BODY_PREFIX}`)) {
            server.moduleGraph.invalidateModule(mod);
          }
        }
        server.ws.send({ type: 'full-reload' });
      });
    },
    closeBundle() {
      if (!isBuild) return;
      const written = prerenderArticles({ root, outDir });
      console.log(`[prerender] Skrev statisk HTML for ${written.length} sider`);
    },
  };
}
