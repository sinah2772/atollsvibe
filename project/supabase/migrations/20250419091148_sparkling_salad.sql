/*
  # Fix Island Categories

  1. Changes
    - Add check constraint for valid island categories
    - Update existing data to use standardized categories
    - Ensure proper category mapping between English and Dhivehi
    
  2. Security
    - Maintains existing RLS policies
*/

-- First drop the existing check constraint if it exists
ALTER TABLE islands DROP CONSTRAINT IF EXISTS check_island_category;

-- Create new check constraint with all valid categories
ALTER TABLE islands ADD CONSTRAINT check_island_category
  CHECK (island_category_en IN (
    'inhabited',
    'uninhabited',
    'resort',
    'industrial',
    'airport',
    'agricultural'
  ));

-- Update all islands to use standardized categories
UPDATE islands 
SET 
  island_category = 
    CASE island_category_en
      WHEN 'inhabited' THEN 'މީހުން ދިރިއުޅޭ'
      WHEN 'uninhabited' THEN 'މީހުން ދިރިނުއުޅޭ'
      WHEN 'resort' THEN 'ރިޒޯޓް'
      WHEN 'industrial' THEN 'ސިނާއީ'
      WHEN 'airport' THEN 'އެއަރޕޯޓް'
      WHEN 'agricultural' THEN 'ދަނޑުވެރިކަން'
    END
WHERE island_category_en IS NOT NULL;

-- Update Hanimaadhoo specifically to be both inhabited and airport
UPDATE islands 
SET 
  island_category = 'މީހުން ދިރިއުޅޭ އަދި އެއަރޕޯޓް',
  island_category_en = 'airport'
WHERE slug = 'hanimaadhoo';

-- Add function to validate category pairs
CREATE OR REPLACE FUNCTION validate_island_categories()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure both categories are either present or null
  IF (NEW.island_category IS NULL) != (NEW.island_category_en IS NULL) THEN
    RAISE EXCEPTION 'Both island_category and island_category_en must be either set or null';
  END IF;

  -- Validate category pairs
  IF NOT (
    (NEW.island_category = 'މީހުން ދިރިއުޅޭ' AND NEW.island_category_en = 'inhabited') OR
    (NEW.island_category = 'މީހުން ދިރިނުއުޅޭ' AND NEW.island_category_en = 'uninhabited') OR
    (NEW.island_category = 'ރިޒޯޓް' AND NEW.island_category_en = 'resort') OR
    (NEW.island_category = 'ސިނާއީ' AND NEW.island_category_en = 'industrial') OR
    (NEW.island_category = 'އެއަރޕޯޓް' AND NEW.island_category_en = 'airport') OR
    (NEW.island_category = 'ދަނޑުވެރިކަން' AND NEW.island_category_en = 'agricultural') OR
    (NEW.island_category = 'މީހުން ދިރިއުޅޭ އަދި އެއަރޕޯޓް' AND NEW.island_category_en = 'airport')
  ) THEN
    RAISE EXCEPTION 'Invalid island category pair';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for category validation
DROP TRIGGER IF EXISTS validate_island_categories ON islands;
CREATE TRIGGER validate_island_categories
  BEFORE INSERT OR UPDATE ON islands
  FOR EACH ROW
  EXECUTE FUNCTION validate_island_categories();