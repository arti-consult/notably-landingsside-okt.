export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  tldr: string | null;
  featured_image_id: string | null;
  category_id: string | null;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  author_id: string | null;
  author_name: string | null;
  author_profile_picture_url: string | null;
  published_at: string | null;
  scheduled_for: string | null;
  view_count: number;
  reading_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleSEOMetadata {
  id: string;
  article_id: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string;
  twitter_card: string;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  schema_json: any;
  seo_score: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleTag {
  id: string;
  article_id: string;
  tag: string;
  created_at: string;
}

export interface ArticleTableOfContents {
  id: string;
  article_id: string;
  toc_json: Array<{
    id: string;
    text: string;
    level: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ArticleAnalytics {
  id: string;
  article_id: string;
  view_date: string;
  views: number;
  unique_visitors: number;
  avg_time_on_page: number;
  created_at: string;
}
