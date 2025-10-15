/*
  # Add Admin Profile Fields

  1. Changes
    - Add profile picture URL field to admin_users
    - Add full name field to admin_users
    - Add biography field to admin_users

  2. New Columns
    - `profile_picture_url` (text, nullable) - URL to profile picture in storage
    - `full_name` (text, nullable) - Admin's full name
    - `bio` (text, nullable) - Admin's biography

  3. Security
    - Existing RLS policies remain in place
    - Admins can update their own profile information
*/

-- Add new columns to admin_users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN profile_picture_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN full_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'bio'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN bio text;
  END IF;
END $$;

-- Update policy to allow admins to update their own profile
DROP POLICY IF EXISTS "Admins can update own profile" ON admin_users;

CREATE POLICY "Admins can update own profile"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);