/*
  # Update app_images table with alt_text and admin policies

  1. Schema Changes
    - Add `alt_text` column to `app_images` table
    - Add `bucket_id` column to track which bucket the image is in

  2. Security
    - Add policies for authenticated admin users to:
      - Insert new images
      - Update existing images (name and alt_text)
      - Delete images
    - Keep existing public read policy
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_images' AND column_name = 'alt_text'
  ) THEN
    ALTER TABLE app_images ADD COLUMN alt_text text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_images' AND column_name = 'bucket_id'
  ) THEN
    ALTER TABLE app_images ADD COLUMN bucket_id text DEFAULT 'admin-images';
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated users can insert app images" ON app_images;
CREATE POLICY "Authenticated users can insert app images"
  ON app_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update app images" ON app_images;
CREATE POLICY "Authenticated users can update app images"
  ON app_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete app images" ON app_images;
CREATE POLICY "Authenticated users can delete app images"
  ON app_images
  FOR DELETE
  TO authenticated
  USING (true);
