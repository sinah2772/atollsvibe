/*
  # Update articles table references

  1. Changes
    - Drop location_id column since we're using atoll_ids array
    - Add foreign key constraint for atoll_ids referencing atolls table
    
  2. Security
    - Maintains existing RLS policies
*/

-- Drop the location_id column since we're using atoll_ids array
ALTER TABLE articles DROP COLUMN IF EXISTS location_id;

-- Add foreign key constraint for atoll_ids
ALTER TABLE articles ADD CONSTRAINT articles_atoll_ids_check 
  CHECK (atoll_ids IS NULL OR array_length(atoll_ids, 1) > 0);

-- Create trigger to validate atoll_ids references
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

CREATE TRIGGER validate_atoll_ids
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION check_atoll_ids();