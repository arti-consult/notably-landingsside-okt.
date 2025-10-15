/*
  # Create Storage Bucket for Integration Logos

  1. Storage Setup
    - Create a public storage bucket named 'integration-logos'
    - Enable public access for reading files
    - Configure bucket for storing integration service logos

  2. Security
    - Public bucket allows anyone to read files
    - Only authenticated users can upload/delete files
    - Appropriate file size limits applied

  3. Purpose
    - Store logos for integration services (Teams, Outlook, Google Meet, Google Calendar)
    - Provide public URLs for displaying logos in the application
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'integration-logos',
  'integration-logos',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for integration logos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'integration-logos');

CREATE POLICY "Authenticated users can upload integration logos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'integration-logos');

CREATE POLICY "Authenticated users can update integration logos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'integration-logos')
  WITH CHECK (bucket_id = 'integration-logos');

CREATE POLICY "Authenticated users can delete integration logos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'integration-logos');
