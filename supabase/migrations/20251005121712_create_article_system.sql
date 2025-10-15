/*
  # Create Article System for SEO-Optimized Blog

  1. New Tables
    - `article_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name in Norwegian
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text, nullable) - Category description
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `articles`
      - `id` (uuid, primary key)
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly identifier
      - `content` (text) - HTML content from editor
      - `excerpt` (text, nullable) - Short excerpt
      - `tldr` (text, nullable) - AI-generated TLDR
      - `featured_image_id` (uuid, nullable) - Reference to media_library
      - `category_id` (uuid, nullable) - Reference to article_categories
      - `status` (text) - draft, published, scheduled, archived
      - `author_id` (uuid) - Reference to auth.users
      - `published_at` (timestamptz, nullable) - Publication date
      - `scheduled_for` (timestamptz, nullable) - Scheduled publication date
      - `view_count` (integer) - Number of views
      - `reading_time_minutes` (integer) - Estimated reading time
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `article_seo_metadata`
      - `id` (uuid, primary key)
      - `article_id` (uuid, unique) - Reference to articles
      - `meta_title` (text, nullable) - SEO title (50-60 chars optimal)
      - `meta_description` (text, nullable) - SEO description (150-160 chars optimal)
      - `meta_keywords` (text[], nullable) - Keywords array
      - `canonical_url` (text, nullable) - Canonical URL
      - `og_title` (text, nullable) - Open Graph title
      - `og_description` (text, nullable) - Open Graph description
      - `og_image` (text, nullable) - Open Graph image URL
      - `og_type` (text) - Open Graph type (article)
      - `twitter_card` (text) - Twitter card type (summary_large_image)
      - `twitter_title` (text, nullable) - Twitter title
      - `twitter_description` (text, nullable) - Twitter description
      - `twitter_image` (text, nullable) - Twitter image URL
      - `schema_json` (jsonb, nullable) - Schema.org structured data
      - `seo_score` (integer) - Calculated SEO score 0-100
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `article_tags`
      - `id` (uuid, primary key)
      - `article_id` (uuid) - Reference to articles
      - `tag` (text) - Tag name
      - `created_at` (timestamptz) - Creation timestamp

    - `article_table_of_contents`
      - `id` (uuid, primary key)
      - `article_id` (uuid, unique) - Reference to articles
      - `toc_json` (jsonb) - Table of contents structure
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `article_analytics`
      - `id` (uuid, primary key)
      - `article_id` (uuid) - Reference to articles
      - `view_date` (date) - Date of view
      - `views` (integer) - Number of views on this date
      - `unique_visitors` (integer) - Unique visitors
      - `avg_time_on_page` (integer) - Average time in seconds
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Public read access to published articles and related data
    - Admin-only write access for all tables
    - Analytics tracking allowed for authenticated users

  3. Indexes
    - Index on articles.slug for fast lookups
    - Index on articles.status for filtering
    - Index on articles.published_at for sorting
    - Index on articles.category_id for filtering
    - Index on article_tags.tag for search
    - Index on article_analytics.article_id and view_date
*/

-- Create article_categories table
CREATE TABLE IF NOT EXISTS article_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL DEFAULT '',
  excerpt text,
  tldr text,
  featured_image_id uuid REFERENCES media_library(id) ON DELETE SET NULL,
  category_id uuid REFERENCES article_categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz,
  scheduled_for timestamptz,
  view_count integer DEFAULT 0,
  reading_time_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create article_seo_metadata table
CREATE TABLE IF NOT EXISTS article_seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid UNIQUE NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  og_type text DEFAULT 'article',
  twitter_card text DEFAULT 'summary_large_image',
  twitter_title text,
  twitter_description text,
  twitter_image text,
  schema_json jsonb,
  seo_score integer DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create article_tags table
CREATE TABLE IF NOT EXISTS article_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, tag)
);

-- Create article_table_of_contents table
CREATE TABLE IF NOT EXISTS article_table_of_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid UNIQUE NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  toc_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create article_analytics table
CREATE TABLE IF NOT EXISTS article_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  view_date date NOT NULL,
  views integer DEFAULT 1,
  unique_visitors integer DEFAULT 1,
  avg_time_on_page integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, view_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag ON article_tags(tag);
CREATE INDEX IF NOT EXISTS idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_analytics_article_date ON article_analytics(article_id, view_date);

-- Enable Row Level Security
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_table_of_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for article_categories
CREATE POLICY "Anyone can view categories"
  ON article_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON article_categories FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can update categories"
  ON article_categories FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can delete categories"
  ON article_categories FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

-- RLS Policies for articles
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  TO public
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "Admins can view all articles"
  ON articles FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

-- RLS Policies for article_seo_metadata
CREATE POLICY "Anyone can view SEO metadata for published articles"
  ON article_seo_metadata FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM articles
    WHERE articles.id = article_seo_metadata.article_id
    AND articles.status = 'published'
    AND articles.published_at <= now()
  ));

CREATE POLICY "Admins can view all SEO metadata"
  ON article_seo_metadata FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can insert SEO metadata"
  ON article_seo_metadata FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can update SEO metadata"
  ON article_seo_metadata FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can delete SEO metadata"
  ON article_seo_metadata FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

-- RLS Policies for article_tags
CREATE POLICY "Anyone can view tags for published articles"
  ON article_tags FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM articles
    WHERE articles.id = article_tags.article_id
    AND articles.status = 'published'
    AND articles.published_at <= now()
  ));

CREATE POLICY "Admins can view all tags"
  ON article_tags FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can insert tags"
  ON article_tags FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can update tags"
  ON article_tags FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can delete tags"
  ON article_tags FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

-- RLS Policies for article_table_of_contents
CREATE POLICY "Anyone can view TOC for published articles"
  ON article_table_of_contents FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM articles
    WHERE articles.id = article_table_of_contents.article_id
    AND articles.status = 'published'
    AND articles.published_at <= now()
  ));

CREATE POLICY "Admins can view all TOC"
  ON article_table_of_contents FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can insert TOC"
  ON article_table_of_contents FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can update TOC"
  ON article_table_of_contents FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can delete TOC"
  ON article_table_of_contents FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

-- RLS Policies for article_analytics
CREATE POLICY "Admins can view analytics"
  ON article_analytics FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can insert analytics"
  ON article_analytics FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can update analytics"
  ON article_analytics FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

CREATE POLICY "Admins can delete analytics"
  ON article_analytics FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@notably.%'
  ));

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_article_categories_updated_at
  BEFORE UPDATE ON article_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_seo_metadata_updated_at
  BEFORE UPDATE ON article_seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_table_of_contents_updated_at
  BEFORE UPDATE ON article_table_of_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
