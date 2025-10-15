/*
  # Add Admin Image Management Policies

  1. Policy Updates
    - Add policies for authenticated admin users to insert, update, and delete images
    - Ensure admins can fully manage the images table
    - Add alt_text column if not exists to images table for better accessibility

  2. Security
    - Only authenticated users (admins) can insert, update, or delete images
    - Public can still read images
    - Maintains existing RLS structure
*/

-- Ensure alt_text column exists in images table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'images' AND column_name = 'alt_text'
  ) THEN
    ALTER TABLE images ADD COLUMN alt_text text;
  END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can insert images" ON images;
  DROP POLICY IF EXISTS "Authenticated users can update images" ON images;
  DROP POLICY IF EXISTS "Authenticated users can delete images" ON images;
  DROP POLICY IF EXISTS "Authenticated users can insert app images" ON app_images;
  DROP POLICY IF EXISTS "Authenticated users can update app images" ON app_images;
  DROP POLICY IF EXISTS "Authenticated users can delete app images" ON app_images;
END $$;

-- Add admin policies for images table
CREATE POLICY "Authenticated users can insert images"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update images"
  ON images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete images"
  ON images
  FOR DELETE
  TO authenticated
  USING (true);

-- Add admin policies for app_images table
CREATE POLICY "Authenticated users can insert app images"
  ON app_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update app images"
  ON app_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete app images"
  ON app_images
  FOR DELETE
  TO authenticated
  USING (true);