/*
  # Fix articles table schema

  1. Changes
    - Drop and recreate articles table with proper constraints
    - Add proper indexes for performance
    - Set up RLS policies
    
  2. Security
    - Maintain existing RLS policies
    - Ensure proper cascade behavior
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Users can read published articles" ON articles;
  DROP POLICY IF EXISTS "Users can create articles" ON articles;
  DROP POLICY IF EXISTS "Users can update own articles" ON articles;
  DROP POLICY IF EXISTS "Users can delete own articles" ON articles;
  DROP POLICY IF EXISTS "Admins can manage all articles" ON articles;

  -- Drop constraints if they exist
  ALTER TABLE articles 
    DROP CONSTRAINT IF EXISTS articles_title_check,
    DROP CONSTRAINT IF EXISTS articles_heading_check,
    DROP CONSTRAINT IF EXISTS articles_atoll_ids_check;

  -- Drop trigger if it exists
  DROP TRIGGER IF EXISTS validate_atoll_ids ON articles;
END $$;

-- Add constraints
ALTER TABLE articles
ADD CONSTRAINT articles_title_check
  CHECK (length(title) >= 3 AND length(title) <= 300),
ADD CONSTRAINT articles_heading_check
  CHECK (length(heading) >= 3 AND length(heading) <= 300),
ADD CONSTRAINT articles_atoll_ids_check
  CHECK (atoll_ids IS NULL OR array_length(atoll_ids, 1) > 0);

-- Add comments
COMMENT ON COLUMN articles.title IS 'Article title in Latin script';
COMMENT ON COLUMN articles.heading IS 'Article title in Thaana script';

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS articles_category_id_idx ON articles(category_id);
CREATE INDEX IF NOT EXISTS articles_user_id_idx ON articles(user_id);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);
CREATE INDEX IF NOT EXISTS articles_publish_date_idx ON articles(publish_date);
CREATE INDEX IF NOT EXISTS articles_atoll_ids_gin_idx ON articles USING gin(atoll_ids);
CREATE INDEX IF NOT EXISTS articles_title_idx ON articles USING gin(to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS articles_heading_idx ON articles USING gin(to_tsvector('simple', heading));

-- Create or replace function to validate atoll IDs
CREATE OR REPLACE FUNCTION check_atoll_ids()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM unnest(NEW.atoll_ids) aid
    LEFT JOIN atolls a ON a.id = aid
    WHERE a.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Invalid atoll_id found in atoll_ids array';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for atoll ID validation
CREATE TRIGGER validate_atoll_ids
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION check_atoll_ids();

-- Add RLS policies
CREATE POLICY "Users can read published articles"
  ON articles
  FOR SELECT
  TO public
  USING ((status = 'published') OR (auth.uid() = user_id));

CREATE POLICY "Users can create articles"
  ON articles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own articles"
  ON articles
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own articles"
  ON articles
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );