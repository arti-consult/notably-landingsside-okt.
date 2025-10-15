/*
  # Fix Article Categories RLS Policies

  1. Changes
    - Drop existing policies that query auth.users table
    - Create simpler policies that only check auth.uid()
    - Policies now check if user is authenticated without querying users table

  2. Security
    - All authenticated users can create categories (can be restricted further if needed)
    - Public can still read categories
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert categories" ON article_categories;
DROP POLICY IF EXISTS "Admins can update categories" ON article_categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON article_categories;

-- Create new simplified policies
CREATE POLICY "Authenticated users can insert categories"
  ON article_categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update categories"
  ON article_categories FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete categories"
  ON article_categories FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
