/*
  # Update news articles schema for bilingual support

  1. Changes
    - Add validation for title and heading fields
    - Add check constraints to ensure proper content
    - Add indexes for better search performance
    
  2. Security
    - Maintains existing RLS policies
*/

-- Add check constraints for title and heading
ALTER TABLE news_articles
ADD CONSTRAINT news_articles_title_check
  CHECK (length(title) >= 3 AND length(title) <= 300),
ADD CONSTRAINT news_articles_heading_check
  CHECK (length(heading) >= 3 AND length(heading) <= 300);

-- Add indexes for search performance
CREATE INDEX IF NOT EXISTS news_articles_title_idx ON news_articles USING gin(to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS news_articles_heading_idx ON news_articles USING gin(to_tsvector('simple', heading));

-- Add comment to clarify field usage
COMMENT ON COLUMN news_articles.title IS 'Article title in Latin script';
COMMENT ON COLUMN news_articles.heading IS 'Article title in Thaana script';