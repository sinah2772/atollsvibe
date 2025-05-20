/*
  # Add News Article Schema

  1. Changes
    - Add news_type column to articles table
    - Add news_priority column for sorting
    - Add news_source column for attribution
    
  2. Security
    - Maintains existing RLS policies
*/

-- Add news-specific columns to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS news_type text,
ADD COLUMN IF NOT EXISTS news_priority integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS news_source text;

-- Create index for better performance on news queries
CREATE INDEX IF NOT EXISTS articles_news_type_idx ON articles(news_type);
CREATE INDEX IF NOT EXISTS articles_news_priority_idx ON articles(news_priority);

-- Add check constraint for news_priority
ALTER TABLE articles 
ADD CONSTRAINT check_news_priority 
CHECK (news_priority >= 0 AND news_priority <= 100);

-- Add check constraint for news_type
ALTER TABLE articles 
ADD CONSTRAINT check_news_type 
CHECK (
  news_type IS NULL OR 
  news_type IN (
    'breaking', 
    'featured', 
    'regular',
    'developing'
  )
);