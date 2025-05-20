/*
  # Fix news_articles user relationship

  1. Changes
    - Drop existing foreign key that references auth.users
    - Add new foreign key constraint to reference public.users table
    
  2. Notes
    - This fixes the relationship between news_articles and users tables
    - Enables proper joins between news_articles and users in the public schema
*/

DO $$ 
BEGIN
  -- First check if the constraint exists before trying to drop it
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'news_articles_user_id_fkey'
    AND table_schema = 'public'
    AND table_name = 'news_articles'
  ) THEN
    ALTER TABLE public.news_articles DROP CONSTRAINT IF EXISTS news_articles_user_id_fkey;
  END IF;
END $$;

-- Add new foreign key constraint referencing public.users
ALTER TABLE public.news_articles
ADD CONSTRAINT news_articles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id);