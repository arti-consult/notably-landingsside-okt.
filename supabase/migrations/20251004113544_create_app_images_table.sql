/*
  # Create app images table

  1. New Tables
    - `app_images`
      - `id` (uuid, primary key)
      - `name` (text) - Name/description of the image
      - `file_name` (text) - Original filename
      - `storage_path` (text) - Path in storage bucket
      - `public_url` (text) - Public URL to access the image
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `app_images` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS app_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view app images"
  ON app_images
  FOR SELECT
  TO public
  USING (true);

-- Insert the app demo image reference
INSERT INTO app_images (name, file_name, storage_path, public_url)
VALUES (
  'App Dashboard Demo',
  'Skjermbilde 2025-10-04 kl. 13.33.08.png',
  'app-images/app-demo-dashboard.png',
  'https://0ec90b57d6e95fcbda19832f.supabase.co/storage/v1/object/public/app-images/app-demo-dashboard.png'
);
