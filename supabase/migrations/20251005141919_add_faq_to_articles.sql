/*
  # Add FAQ field to articles table

  1. Changes
    - Add `faq_json` column to `articles` table to store FAQ data as JSON array
    - Each FAQ item contains `question` and `answer` fields
    
  2. Notes
    - Using JSONB for efficient querying and indexing
    - FAQ will be AI-generated based on article content
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'faq_json'
  ) THEN
    ALTER TABLE articles ADD COLUMN faq_json JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;