/*
  # Add Author Snapshot Fields To Articles

  1. Changes
    - Add `author_name` to `articles`
    - Add `author_profile_picture_url` to `articles`
    - Backfill existing articles from `admin_users`

  2. Why
    - Published articles should expose author name and profile image without relying on direct reads from `admin_users`.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'author_name'
  ) THEN
    ALTER TABLE articles ADD COLUMN author_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'author_profile_picture_url'
  ) THEN
    ALTER TABLE articles ADD COLUMN author_profile_picture_url text;
  END IF;
END $$;

ALTER TABLE articles
  ALTER COLUMN author_name SET DEFAULT 'Notably Team';

UPDATE articles a
SET
  author_name = COALESCE(NULLIF(au.full_name, ''), 'Notably Team'),
  author_profile_picture_url = au.profile_picture_url
FROM admin_users au
WHERE a.author_id = au.id
  AND (
    a.author_name IS NULL
    OR btrim(a.author_name) = ''
    OR a.author_profile_picture_url IS DISTINCT FROM au.profile_picture_url
  );

UPDATE articles
SET author_name = 'Notably Team'
WHERE author_name IS NULL OR btrim(author_name) = '';
