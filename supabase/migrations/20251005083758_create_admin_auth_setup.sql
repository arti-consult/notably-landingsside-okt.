/*
  # Admin Authentication Setup

  1. Security
    - Sets up auth.users table (already exists in Supabase)
    - Creates admin_users table to track admin privileges
    - Enables RLS on admin_users table
    - Only authenticated admins can read admin status
    - Only service role can create/update admin users

  2. Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  3. Notes
    - User creation will be done via Supabase Auth API
    - This table just tracks which users have admin access
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Only service role can insert admin users"
  ON admin_users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update admin users"
  ON admin_users
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);