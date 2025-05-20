/*
  # Add News Articles Schema

  1. New Tables
    - `news_articles` table for managing news content
    - Includes fields for content, metadata, workflow, and tracking
    
  2. Security
    - Enable RLS
    - Add policies for public access and author management
*/

-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
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
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  news_type text CHECK (news_type IN ('breaking', 'featured', 'regular', 'developing')),
  news_priority integer CHECK (news_priority >= 0 AND news_priority <= 100) DEFAULT 0,
  news_source text,
  is_featured boolean DEFAULT false,
  is_breaking boolean DEFAULT false,
  is_developing boolean DEFAULT false,
  is_exclusive boolean DEFAULT false,
  is_sponsored boolean DEFAULT false,
  sponsored_by text,
  sponsored_url text,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  related_articles uuid[],
  tags text[],
  author_notes text,
  editor_notes text,
  fact_checked boolean DEFAULT false,
  fact_checker_id uuid REFERENCES auth.users(id),
  fact_checked_at timestamptz,
  approved_by_id uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  published_by_id uuid REFERENCES auth.users(id),
  last_updated_by_id uuid REFERENCES auth.users(id),
  original_source_url text,
  translation_source_url text,
  translation_source_lang text,
  translation_notes text,
  revision_history jsonb DEFAULT '[]',
  scheduled_notifications jsonb DEFAULT '{}',
  notification_sent boolean DEFAULT false,
  notification_sent_at timestamptz
);

-- Enable RLS
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX news_articles_category_id_idx ON news_articles(category_id);
CREATE INDEX news_articles_user_id_idx ON news_articles(user_id);
CREATE INDEX news_articles_status_idx ON news_articles(status);
CREATE INDEX news_articles_publish_date_idx ON news_articles(publish_date);
CREATE INDEX news_articles_news_type_idx ON news_articles(news_type);
CREATE INDEX news_articles_news_priority_idx ON news_articles(news_priority);
CREATE INDEX news_articles_is_featured_idx ON news_articles(is_featured) WHERE is_featured = true;
CREATE INDEX news_articles_is_breaking_idx ON news_articles(is_breaking) WHERE is_breaking = true;
CREATE INDEX news_articles_is_developing_idx ON news_articles(is_developing) WHERE is_developing = true;
CREATE INDEX news_articles_tags_gin_idx ON news_articles USING gin(tags);
CREATE INDEX news_articles_meta_keywords_gin_idx ON news_articles USING gin(meta_keywords);
CREATE INDEX news_articles_atoll_ids_gin_idx ON news_articles USING gin(atoll_ids);

-- Add RLS policies
CREATE POLICY "Public can read published articles"
  ON news_articles
  FOR SELECT
  TO public
  USING (
    status = 'published' 
    AND publish_date <= now()
    AND (NOT is_sponsored OR (is_sponsored AND sponsored_by IS NOT NULL))
  );

CREATE POLICY "Authors can manage their own articles"
  ON news_articles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all articles"
  ON news_articles
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_news_article_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_news_article_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_news_article_updated_at();

-- Create function to validate atoll_ids
CREATE OR REPLACE FUNCTION validate_news_article_atoll_ids()
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

-- Create trigger to validate atoll_ids
CREATE TRIGGER validate_news_article_atoll_ids
  BEFORE INSERT OR UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION validate_news_article_atoll_ids();

-- Create function to update revision history
CREATE OR REPLACE FUNCTION update_news_article_revision_history()
RETURNS TRIGGER AS $$
DECLARE
  revision jsonb;
BEGIN
  -- Create revision entry
  revision = jsonb_build_object(
    'timestamp', now(),
    'user_id', auth.uid(),
    'changes', jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );

  -- Add revision to history array
  NEW.revision_history = coalesce(OLD.revision_history, '[]'::jsonb) || revision;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to track revision history
CREATE TRIGGER update_news_article_revision_history
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_news_article_revision_history();