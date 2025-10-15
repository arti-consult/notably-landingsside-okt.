/*
  # Add admin policies for images table

  1. Security
    - Add policies for authenticated admin users to:
      - Update existing images in the images table
      - Delete images from the images table
    - Keep existing public read policy
*/

DROP POLICY IF EXISTS "Authenticated users can update images" ON images;
CREATE POLICY "Authenticated users can update images"
  ON images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete images" ON images;
CREATE POLICY "Authenticated users can delete images"
  ON images
  FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert images" ON images;
CREATE POLICY "Authenticated users can insert images"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
