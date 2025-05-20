/*
  # Fix articles table migration
  
  1. Changes
    - Remove news_articles references since table doesn't exist
    - Keep core table structure and policies
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read published articles" ON articles;
DROP POLICY IF EXISTS "Users can create articles" ON articles;
DROP POLICY IF EXISTS "Users can update own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete own articles" ON articles;
DROP POLICY IF EXISTS "Admins can manage all articles" ON articles;

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  heading text NOT NULL,
  social_heading text,
  content jsonb NOT NULL DEFAULT '{}',
  category_id integer REFERENCES categories(id),
  atoll_ids integer[] DEFAULT '{}',
  cover_image text,
  image_caption text,
  status text NOT NULL DEFAULT 'draft',
  publish_date timestamptz,
  views integer NOT NULL DEFAULT 0,
  likes integer NOT NULL DEFAULT 0,
  comments integer NOT NULL DEFAULT 0,
  user_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add comments
COMMENT ON COLUMN articles.title IS 'Article title in Latin script';
COMMENT ON COLUMN articles.heading IS 'Article title in Thaana script';

-- Add constraints
ALTER TABLE articles
ADD CONSTRAINT articles_title_check
  CHECK (length(title) >= 3 AND length(title) <= 300),
ADD CONSTRAINT articles_heading_check
  CHECK (length(heading) >= 3 AND length(heading) <= 300),
ADD CONSTRAINT articles_atoll_ids_check
  CHECK (atoll_ids IS NULL OR array_length(atoll_ids, 1) > 0);

-- Create indexes
CREATE INDEX IF NOT EXISTS articles_category_id_idx ON articles(category_id);
CREATE INDEX IF NOT EXISTS articles_user_id_idx ON articles(user_id);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);
CREATE INDEX IF NOT EXISTS articles_publish_date_idx ON articles(publish_date);
CREATE INDEX IF NOT EXISTS articles_atoll_ids_gin_idx ON articles USING gin(atoll_ids);
CREATE INDEX IF NOT EXISTS articles_title_idx ON articles USING gin(to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS articles_heading_idx ON articles USING gin(to_tsvector('simple', heading));

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create function to validate atoll IDs
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
DROP TRIGGER IF EXISTS validate_atoll_ids ON articles;
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