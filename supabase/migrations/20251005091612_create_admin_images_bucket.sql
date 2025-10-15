/*
  # Create Storage Bucket for Admin Image Uploads

  1. Storage Setup
    - Create a public storage bucket named 'admin-images'
    - Enable public access for reading files
    - Configure bucket for storing user-uploaded images from admin panel

  2. Security
    - Public bucket allows anyone to read files (for displaying on website)
    - Only authenticated users (admins) can upload/delete files
    - File size limit: 10MB
    - Allowed file types: images only (PNG, JPG, JPEG, WebP, SVG, GIF)

  3. Purpose
    - Store images uploaded by admins through the admin panel
    - Provide public URLs for displaying images in the application
    - Centralized storage for all admin-managed images
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'admin-images',
  'admin-images',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for admin images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'admin-images');

CREATE POLICY "Authenticated users can upload admin images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'admin-images');

CREATE POLICY "Authenticated users can update admin images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'admin-images')
  WITH CHECK (bucket_id = 'admin-images');

CREATE POLICY "Authenticated users can delete admin images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'admin-images');