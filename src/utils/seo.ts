export interface SEOScore {
  score: number;
  issues: string[];
  suggestions: string[];
}

export function calculateSEOScore(data: {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  content: string;
  keywords?: string[];
  slug: string;
  featuredImage?: boolean;
}): SEOScore {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  if (!data.title || data.title.length === 0) {
    issues.push('Tittel mangler');
    score -= 20;
  } else if (data.title.length > 60) {
    issues.push('Tittel er for lang (over 60 tegn)');
    score -= 5;
  } else if (data.title.length < 30) {
    suggestions.push('Tittel kan være litt lengre for bedre SEO (30-60 tegn)');
    score -= 3;
  }

  if (!data.metaTitle || data.metaTitle.length === 0) {
    issues.push('Meta-tittel mangler');
    score -= 15;
  } else if (data.metaTitle.length > 60) {
    issues.push('Meta-tittel er for lang (over 60 tegn)');
    score -= 5;
  } else if (data.metaTitle.length < 30) {
    suggestions.push('Meta-tittel kan være litt lengre (30-60 tegn)');
    score -= 3;
  }

  if (!data.metaDescription || data.metaDescription.length === 0) {
    issues.push('Meta-beskrivelse mangler');
    score -= 15;
  } else if (data.metaDescription.length > 160) {
    issues.push('Meta-beskrivelse er for lang (over 160 tegn)');
    score -= 5;
  } else if (data.metaDescription.length < 120) {
    suggestions.push('Meta-beskrivelse kan være litt lengre (120-160 tegn)');
    score -= 3;
  }

  const wordCount = countWords(stripHtml(data.content));
  if (wordCount < 300) {
    issues.push('Artikkel er for kort (under 300 ord)');
    score -= 15;
  } else if (wordCount < 600) {
    suggestions.push('Artikkel kan være lengre for bedre SEO (minst 1000 ord anbefales)');
    score -= 5;
  }

  const headings = extractHeadings(data.content);
  if (headings.h1.length === 0) {
    issues.push('H1-overskrift mangler');
    score -= 10;
  } else if (headings.h1.length > 1) {
    issues.push('Flere enn én H1-overskrift (kun én anbefales)');
    score -= 5;
  }

  if (headings.h2.length === 0) {
    suggestions.push('Legg til H2-overskrifter for bedre struktur');
    score -= 5;
  }

  if (!data.keywords || data.keywords.length === 0) {
    suggestions.push('Legg til nøkkelord for bedre SEO');
    score -= 5;
  } else if (data.keywords.length < 3) {
    suggestions.push('Legg til flere nøkkelord (5-8 anbefales)');
    score -= 3;
  }

  if (!data.slug || data.slug.length === 0) {
    issues.push('URL-slug mangler');
    score -= 10;
  } else if (data.slug.length > 60) {
    suggestions.push('URL-slug er ganske lang (kortere er bedre)');
    score -= 2;
  }

  if (!data.featuredImage) {
    suggestions.push('Legg til et hovedbilde for bedre deling på sosiale medier');
    score -= 5;
  }

  const images = extractImages(data.content);
  const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.length === 0);
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} bilde(r) mangler alt-tekst`);
    score -= Math.min(imagesWithoutAlt.length * 3, 15);
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    suggestions,
  };
}

export function generateSlug(title: string): string {
  return title
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

export function calculateReadingTime(content: string): number {
  const words = countWords(stripHtml(content));
  const wordsPerMinute = 200;
  return Math.ceil(words / wordsPerMinute);
}

export function extractHeadings(html: string): {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
} {
  const temp = document.createElement('div');
  temp.innerHTML = html;

  return {
    h1: Array.from(temp.querySelectorAll('h1')).map(h => h.textContent || ''),
    h2: Array.from(temp.querySelectorAll('h2')).map(h => h.textContent || ''),
    h3: Array.from(temp.querySelectorAll('h3')).map(h => h.textContent || ''),
    h4: Array.from(temp.querySelectorAll('h4')).map(h => h.textContent || ''),
    h5: Array.from(temp.querySelectorAll('h5')).map(h => h.textContent || ''),
    h6: Array.from(temp.querySelectorAll('h6')).map(h => h.textContent || ''),
  };
}

export function generateTableOfContents(html: string): Array<{
  id: string;
  text: string;
  level: number;
}> {
  const temp = document.createElement('div');
  temp.innerHTML = html;

  const headings = temp.querySelectorAll('h2, h3');
  const toc: Array<{ id: string; text: string; level: number }> = [];

  headings.forEach((heading, index) => {
    const text = heading.textContent || '';
    const level = parseInt(heading.tagName[1]);
    const id = `heading-${index}-${generateSlug(text)}`;

    heading.id = id;

    toc.push({ id, text, level });
  });

  return toc;
}

function extractImages(html: string): Array<{ src: string; alt: string }> {
  const temp = document.createElement('div');
  temp.innerHTML = html;

  const images = temp.querySelectorAll('img');
  return Array.from(images).map(img => ({
    src: img.src,
    alt: img.alt,
  }));
}

function stripHtml(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function generateSchemaOrgArticle(data: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  imageUrl?: string;
  canonicalUrl: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    author: {
      '@type': 'Organization',
      name: data.author,
    },
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate || data.publishedDate,
    image: data.imageUrl,
    url: data.canonicalUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Notably',
      logo: {
        '@type': 'ImageObject',
        url: 'https://notably.no/logo.png',
      },
    },
  };
}
