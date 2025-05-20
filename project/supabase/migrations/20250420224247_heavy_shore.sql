/*
  # Add Island IDs Support

  1. Changes
    - Add function to check island IDs
    - Add trigger to validate island IDs
    - Add index for better performance
    - Add constraint if it doesn't exist
    
  2. Security
    - Maintains existing RLS policies
*/

-- Add check function for island IDs if it doesn't exist
CREATE OR REPLACE FUNCTION check_island_ids()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM unnest(NEW.island_ids) iid
    LEFT JOIN islands i ON i.id = iid
    WHERE i.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Invalid island_id found in island_ids array';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for island ID validation
DROP TRIGGER IF EXISTS validate_island_ids ON articles;
CREATE TRIGGER validate_island_ids
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION check_island_ids();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS articles_island_ids_gin_idx ON articles USING gin(island_ids);

-- Add check constraint only if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'articles_island_ids_check' AND conrelid = 'articles'::regclass
  ) THEN
    ALTER TABLE articles 
    ADD CONSTRAINT articles_island_ids_check 
      CHECK (island_ids IS NULL OR array_length(island_ids, 1) > 0);
  END IF;
END $$;

-- Add comment to column
COMMENT ON COLUMN articles.island_ids IS 'Array of island IDs referenced in the article';