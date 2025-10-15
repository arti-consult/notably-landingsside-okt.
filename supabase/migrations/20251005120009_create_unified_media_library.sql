/*
  # Create unified media library system

  1. New Tables
    - `media_library`
      - `id` (uuid, primary key)
      - `name` (text) - Display name of the image
      - `alt_text` (text) - Alt text for accessibility
      - `file_name` (text) - Original filename
      - `storage_path` (text) - Path in storage
      - `public_url` (text) - Public URL
      - `file_size` (bigint) - File size in bytes
      - `mime_type` (text) - MIME type
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `media_library` table
    - Public read access for all images
    - Authenticated users can insert, update, delete
*/

CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  alt_text text DEFAULT '',
  file_name text NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  file_size bigint DEFAULT 0,
  mime_type text DEFAULT 'image/png',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view media" ON media_library;
CREATE POLICY "Anyone can view media"
  ON media_library
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert media" ON media_library;
CREATE POLICY "Authenticated users can insert media"
  ON media_library
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update media" ON media_library;
CREATE POLICY "Authenticated users can update media"
  ON media_library
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete media" ON media_library;
CREATE POLICY "Authenticated users can delete media"
  ON media_library
  FOR DELETE
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_media_library_updated_at ON media_library;
CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON media_library
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
