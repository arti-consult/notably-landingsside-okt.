// Typer for artiklene som bygges fra content/artikler/*.md (se scripts/vite-plugin-articles.mjs).
declare module 'virtual:articles' {
  export interface ArticleSummary {
    slug: string;
    title: string;
    seoTitle: string;
    description: string;
    excerpt: string;
    tldr: string;
    published: string;
    updated: string;
    author: { name: string; image: string | null };
    category: { name: string; slug: string } | null;
    tags: string[];
    image: { src: string; alt: string } | null;
    readingTime: number;
    draft: boolean;
  }

  export interface ArticleBody {
    html: string;
    faq: Array<{ question: string; answer: string }>;
    toc: Array<{ id: string; text: string; level: number }>;
  }

  export const articles: ArticleSummary[];
  export function loadArticleBody(slug: string): Promise<ArticleBody | null>;
}
