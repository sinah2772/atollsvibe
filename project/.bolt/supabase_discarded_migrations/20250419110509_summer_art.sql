/*
  # Copy news_articles to articles table

  1. Changes
    - Drop existing policies before recreating them
    - Copy remaining data from news_articles
    - Drop news_articles table
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read published articles" ON articles;
DROP POLICY IF EXISTS "Users can create articles" ON articles;
DROP POLICY IF EXISTS "Users can update own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete own articles" ON articles;
DROP POLICY IF EXISTS "Admins can manage all articles" ON articles;

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

-- Copy remaining data from news_articles to articles
INSERT INTO articles (
  id, title, heading, social_heading, content, category_id, atoll_ids,
  cover_image, image_caption, status, publish_date, views, likes, comments,
  user_id, created_at, updated_at
)
SELECT 
  id, title, heading, social_heading, content, category_id, atoll_ids,
  cover_image, image_caption, status, publish_date, views, likes, comments,
  user_id, created_at, updated_at
FROM news_articles
ON CONFLICT (id) DO NOTHING;

-- Drop news_articles table
DROP TABLE news_articles;