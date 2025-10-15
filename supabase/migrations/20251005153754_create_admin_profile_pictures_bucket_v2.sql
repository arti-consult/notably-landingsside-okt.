/*
  # Create Admin Profile Pictures Storage Bucket

  1. New Storage Bucket
    - `admin-profile-pictures` - Stores admin profile pictures
    - Public bucket for easy access
    - Only authenticated admins can upload/update

  2. Security
    - Enable RLS on storage.objects
    - Admins can upload their own profile pictures
    - Admins can update their own profile pictures
    - Admins can delete their own profile pictures
    - Anyone can view profile pictures (public read)
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-profile-pictures', 'admin-profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can upload own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;

-- Allow authenticated admins to upload their own profile pictures
CREATE POLICY "Admins can upload own profile picture"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'admin-profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Allow authenticated admins to update their own profile pictures
CREATE POLICY "Admins can update own profile picture"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'admin-profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'admin-profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Allow authenticated admins to delete their own profile pictures
CREATE POLICY "Admins can delete own profile picture"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'admin-profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Allow anyone to view profile pictures
CREATE POLICY "Anyone can view profile pictures"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'admin-profile-pictures');