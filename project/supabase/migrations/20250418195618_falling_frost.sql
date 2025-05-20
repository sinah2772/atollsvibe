/*
  # Fix atoll_ids column in articles table

  1. Changes
     - Safely adds the atoll_ids column to the articles table if it doesn't exist
     - No column removal since the previous migration failed

  This migration fixes the previous failed migration by safely adding the atoll_ids column
  without attempting to drop a non-existent column.
*/

-- Check if atoll_ids column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'atoll_ids'
  ) THEN
    ALTER TABLE articles ADD COLUMN atoll_ids integer[] DEFAULT '{}';
  END IF;
END $$;