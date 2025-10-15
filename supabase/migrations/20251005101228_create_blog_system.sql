/*
  # Blog Article Management System with SEO Optimization

  ## Overview
  Complete blog article management system designed for maximum SEO performance.
  All articles will be accessible under /blog route with full schema markup support.

  ## 1. New Tables

  ### `blog_categories`
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text, not null) - Category display name
  - `slug` (text, unique, not null) - URL-friendly category identifier
  - `description` (text) - Category description for SEO
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `blog_tags`
  - `id` (uuid, primary key) - Unique tag identifier
  - `name` (text, unique, not null) - Tag display name
  - `slug` (text, unique, not null) - URL-friendly tag identifier
  - `created_at` (timestamptz) - Creation timestamp

  ### `blog_articles`
  - `id` (uuid, primary key) - Unique article identifier
  - `title` (text, not null) - Article title (H1)
  - `slug` (text, unique, not null) - URL-friendly article identifier
  - `excerpt` (text) - Short article summary
  - `content` (text, not null) - Main article content (HTML)
  - `featured_image_url` (text) - URL to featured/hero image
  - `featured_image_alt` (text) - Alt text for featured image
  - `author_name` (text, not null) - Article author name
  - `author_id` (uuid) - Reference to admin user
  - `category_id` (uuid) - Reference to category
  - `status` (text, not null, default 'draft') - Publication status: draft, published
  - `published_at` (timestamptz) - Publication timestamp
  - `view_count` (integer, default 0) - Number of article views
  - `reading_time_minutes` (integer) - Estimated reading time
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `blog_article_tags`
  - `article_id` (uuid, references blog_articles) - Article reference
  - `tag_id` (uuid, references blog_tags) - Tag reference
  - Primary key on (article_id, tag_id)

  ### `blog_seo_metadata`
  - `id` (uuid, primary key) - Unique identifier
  - `article_id` (uuid, unique, references blog_articles) - Article reference
  - `meta_title` (text) - Custom SEO title (overrides article title)
  - `meta_description` (text) - SEO meta description (150-160 chars recommended)
  - `focus_keyword` (text) - Primary target keyword
  - `canonical_url` (text) - Canonical URL if different from default
  - `og_title` (text) - Open Graph title for social media
  - `og_description` (text) - Open Graph description
  - `og_image` (text) - Open Graph image URL
  - `twitter_card` (text, default 'summary_large_image') - Twitter card type
  - `schema_markup` (jsonb) - Article schema markup in JSON-LD format
  - `tldr_summary` (text) - AI-generated or manual TLDR summary
  - `table_of_contents` (jsonb) - Generated table of contents structure
  - `breadcrumbs` (jsonb) - Breadcrumb navigation structure
  - `faq_schema` (jsonb) - FAQ schema markup if applicable
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security (Row Level Security)

  ### Public Access
  - Anyone can view published articles, categories, tags, and SEO metadata
  - View count can be incremented by anyone

  ### Admin Access
  - Only authenticated admins can create, update, and delete articles
  - Only authenticated admins can manage categories and tags
  - Draft articles are only visible to authenticated admins

  ## 3. Indexes for Performance
  - Slug indexes for fast lookups on articles, categories, and tags
  - Published_at index for chronological queries
  - Category and status indexes for filtering
  - Full-text search index on article content and title

  ## 4. Important Notes
  - All published articles must have slug, title, and content
  - Slugs are automatically generated but can be customized
  - Schema markup is stored as JSONB for flexibility
  - Table of contents is auto-generated from heading structure
  - TLDR can be AI-generated via Edge Function or manually entered
  - View counts are tracked for content performance analysis
*/

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tags Table
CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Articles Table
CREATE TABLE IF NOT EXISTS blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text NOT NULL,
  featured_image_url text,
  featured_image_alt text,
  author_name text NOT NULL DEFAULT 'Notably Team',
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  view_count integer DEFAULT 0,
  reading_time_minutes integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Article-Tag Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS blog_article_tags (
  article_id uuid REFERENCES blog_articles(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- SEO Metadata Table
CREATE TABLE IF NOT EXISTS blog_seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid UNIQUE NOT NULL REFERENCES blog_articles(id) ON DELETE CASCADE,
  meta_title text,
  meta_description text,
  focus_keyword text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  twitter_card text DEFAULT 'summary_large_image',
  schema_markup jsonb,
  tldr_summary text,
  table_of_contents jsonb,
  breadcrumbs jsonb,
  faq_schema jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Article indexes
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_status ON blog_articles(status);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published_at ON blog_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category_id ON blog_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_articles_author_id ON blog_articles(author_id);

-- Full-text search index on articles
CREATE INDEX IF NOT EXISTS idx_blog_articles_search ON blog_articles USING gin(to_tsvector('english', title || ' ' || content));

-- Category and tag indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);

-- SEO metadata index
CREATE INDEX IF NOT EXISTS idx_blog_seo_metadata_article_id ON blog_seo_metadata(article_id);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_seo_metadata ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES - CATEGORIES
-- ============================================

-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
  ON blog_categories
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated admins can insert categories
CREATE POLICY "Admins can insert categories"
  ON blog_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only authenticated admins can update categories
CREATE POLICY "Admins can update categories"
  ON blog_categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only authenticated admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON blog_categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ============================================
-- 5. CREATE RLS POLICIES - TAGS
-- ============================================

-- Anyone can view tags
CREATE POLICY "Anyone can view tags"
  ON blog_tags
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated admins can insert tags
CREATE POLICY "Admins can insert tags"
  ON blog_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only authenticated admins can update tags
CREATE POLICY "Admins can update tags"
  ON blog_tags
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only authenticated admins can delete tags
CREATE POLICY "Admins can delete tags"
  ON blog_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ============================================
-- 6. CREATE RLS POLICIES - ARTICLES
-- ============================================

-- Anyone can view published articles
CREATE POLICY "Anyone can view published articles"
  ON blog_articles
  FOR SELECT
  TO public
  USING (status = 'published');

-- Admins can view all articles including drafts
CREATE POLICY "Admins can view all articles"
  ON blog_articles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only authenticated admins can insert articles
CREATE POLICY "Admins can insert articles"
  ON blog_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only authenticated admins can update articles
CREATE POLICY "Admins can update articles"
  ON blog_articles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only authenticated admins can delete articles
CREATE POLICY "Admins can delete articles"
  ON blog_articles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ============================================
-- 7. CREATE RLS POLICIES - ARTICLE TAGS
-- ============================================

-- Anyone can view article tags for published articles
CREATE POLICY "Anyone can view article tags"
  ON blog_article_tags
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM blog_articles
      WHERE blog_articles.id = blog_article_tags.article_id
      AND blog_articles.status = 'published'
    )
  );

-- Admins can view all article tags
CREATE POLICY "Admins can view all article tags"
  ON blog_article_tags
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only authenticated admins can manage article tags
CREATE POLICY "Admins can insert article tags"
  ON blog_article_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete article tags"
  ON blog_article_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ============================================
-- 8. CREATE RLS POLICIES - SEO METADATA
-- ============================================

-- Anyone can view SEO metadata for published articles
CREATE POLICY "Anyone can view published article SEO metadata"
  ON blog_seo_metadata
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM blog_articles
      WHERE blog_articles.id = blog_seo_metadata.article_id
      AND blog_articles.status = 'published'
    )
  );

-- Admins can view all SEO metadata
CREATE POLICY "Admins can view all SEO metadata"
  ON blog_seo_metadata
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only authenticated admins can manage SEO metadata
CREATE POLICY "Admins can insert SEO metadata"
  ON blog_seo_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update SEO metadata"
  ON blog_seo_metadata
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete SEO metadata"
  ON blog_seo_metadata
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ============================================
-- 9. CREATE UPDATED_AT TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for blog_categories
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for blog_articles
DROP TRIGGER IF EXISTS update_blog_articles_updated_at ON blog_articles;
CREATE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for blog_seo_metadata
DROP TRIGGER IF EXISTS update_blog_seo_metadata_updated_at ON blog_seo_metadata;
CREATE TRIGGER update_blog_seo_metadata_updated_at
  BEFORE UPDATE ON blog_seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. INSERT SAMPLE CATEGORIES
-- ============================================

INSERT INTO blog_categories (name, slug, description) VALUES
  ('Product Updates', 'product-updates', 'Latest updates and new features from Notably'),
  ('Meeting Tips', 'meeting-tips', 'Tips and best practices for effective meetings'),
  ('AI & Technology', 'ai-technology', 'Insights on AI and meeting technology'),
  ('Comparisons', 'comparisons', 'Compare Notably with other meeting tools')
ON CONFLICT (slug) DO NOTHING;
