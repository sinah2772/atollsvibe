/*
  # Update island categories

  1. Changes
    - Add columns for island category collection and item IDs
    - Add functions to standardize categories
    - Update island categories with standardized values
    
  2. Security
    - Maintains existing RLS policies
*/

-- First check if the islands table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'islands') THEN
    -- Create islands table if it doesn't exist
    CREATE TABLE islands (
      id SERIAL PRIMARY KEY,
      name text NOT NULL,
      name_en text NOT NULL,
      slug text UNIQUE NOT NULL,
      island_code text,
      island_category text,
      island_category_en text,
      island_details text,
      longitude text,
      latitude text,
      election_commission_code text,
      postal_code text,
      other_name_en text,
      other_name_dv text,
      list_order integer,
      atoll_id integer REFERENCES atolls(id),
      created_at timestamptz DEFAULT now() NOT NULL
    );

    -- Enable RLS
    ALTER TABLE islands ENABLE ROW LEVEL SECURITY;

    -- Add policies
    CREATE POLICY "Islands are readable by everyone"
      ON islands
      FOR SELECT
      TO public
      USING (true);

    CREATE POLICY "Only admins can modify islands"
      ON islands
      USING (
        (SELECT is_admin FROM users WHERE id = auth.uid())
      )
      WITH CHECK (
        (SELECT is_admin FROM users WHERE id = auth.uid())
      );
  END IF;
END $$;

-- Add collection and item ID columns
ALTER TABLE islands 
ADD COLUMN IF NOT EXISTS island_category_collection_id text,
ADD COLUMN IF NOT EXISTS island_category_item_id text;

-- Create standardization function
CREATE OR REPLACE FUNCTION standardize_island_category(category text)
RETURNS text AS $$
BEGIN
  RETURN CASE
    WHEN category ILIKE '%inhabited%' OR category ILIKE '%މީހުން ދިރިއުޅޭ%' THEN 'inhabited'
    WHEN category ILIKE '%uninhabited%' OR category ILIKE '%މީހުން ދިރިނުއުޅޭ%' THEN 'uninhabited-islands'
    WHEN category ILIKE '%resort%' OR category ILIKE '%ރިޒޯޓް%' THEN 'resort'
    WHEN category ILIKE '%developing resort%' OR category ILIKE '%ރިޒޯޓް ތަރައްޤީކުރުމަށް%' THEN 'developing-resort'
    WHEN category ILIKE '%industrial%' OR category ILIKE '%ސިނާއީ%' THEN 'industrial'
    WHEN category ILIKE '%agricultural%' OR category ILIKE '%ދަނޑުވެރިކަން%' THEN 'agricultural-islands'
    WHEN category ILIKE '%fisheries%' OR category ILIKE '%މަސްވެރިކަން%' THEN 'fisheries-industrial-islands'
    WHEN category ILIKE '%aquaculture%' OR category ILIKE '%އެކުއަކަލްޗަރ%' THEN 'aquaculture'
    WHEN category ILIKE '%domestic airport%' OR category ILIKE '%ޑޮމެސްޓިކް އެއަރޕޯޓް%' THEN 'domestic-airport'
    WHEN category ILIKE '%international airport%' OR category ILIKE '%އިންޓަރނޭޝަނަލް އެއަރޕޯޓް%' THEN 'international-airport'
    WHEN category ILIKE '%protected%' OR category ILIKE '%ހިމާޔަތްކޮށްފައި%' THEN 'protected-under-the-environmental-act'
    ELSE category
  END;
END;
$$ LANGUAGE plpgsql;

-- Create function for Dhivehi categories
CREATE OR REPLACE FUNCTION get_dhivehi_category(category_en text)
RETURNS text AS $$
BEGIN
  RETURN CASE
    WHEN category_en = 'inhabited' THEN 'މީހުން ދިރިއުޅޭ'
    WHEN category_en = 'uninhabited-islands' THEN 'މީހުން ދިރިނުއުޅޭ'
    WHEN category_en = 'resort' THEN 'ރިޒޯޓް'
    WHEN category_en = 'developing-resort' THEN 'ރިޒޯޓް ތަރައްޤީކުރުމަށް'
    WHEN category_en = 'industrial' THEN 'ސިނާއީ'
    WHEN category_en = 'agricultural-islands' THEN 'ދަނޑުވެރިކަން ކުރުމަށް'
    WHEN category_en = 'fisheries-industrial-islands' THEN 'މަސްވެރިކަން ކުރުމަށް'
    WHEN category_en = 'aquaculture' THEN 'އެކުއަކަލްޗަރ'
    WHEN category_en = 'domestic-airport' THEN 'ޑޮމެސްޓިކް އެއަރޕޯޓް'
    WHEN category_en = 'international-airport' THEN 'އިންޓަރނޭޝަނަލް އެއަރޕޯޓް'
    WHEN category_en = 'protected-under-the-environmental-act' THEN 'ތިމާވެށީގެ ޤާނޫނުގެ ދަށުން ހިމާޔަތްކޮށްފައި'
    ELSE category_en
  END;
END;
$$ LANGUAGE plpgsql;

-- Update categories with collection and item IDs
UPDATE islands
SET 
  island_category_collection_id = '657ec63a7aaf05e4e6b041c2',
  island_category_item_id = CASE 
    WHEN standardize_island_category(island_category) = 'inhabited' THEN '657ec63a7aaf05e4e6b04278'
    WHEN standardize_island_category(island_category) = 'uninhabited-islands' THEN '657ec63a7aaf05e4e6b0427a'
    WHEN standardize_island_category(island_category) = 'resort' THEN '657ec63a7aaf05e4e6b04279'
    WHEN standardize_island_category(island_category) = 'developing-resort' THEN '657ec63a7aaf05e4e6b0427f'
    WHEN standardize_island_category(island_category) = 'industrial' THEN '657ec63a7aaf05e4e6b0427e'
    WHEN standardize_island_category(island_category) = 'agricultural-islands' THEN '657ec63a7aaf05e4e6b0427b'
    WHEN standardize_island_category(island_category) = 'fisheries-industrial-islands' THEN '657ec63a7aaf05e4e6b0427c'
    WHEN standardize_island_category(island_category) = 'aquaculture' THEN '657ec63a7aaf05e4e6b04281'
    WHEN standardize_island_category(island_category) = 'domestic-airport' THEN '657ec63a7aaf05e4e6b0427d'
    WHEN standardize_island_category(island_category) = 'international-airport' THEN '657ec63a7aaf05e4e6b04277'
    WHEN standardize_island_category(island_category) = 'protected-under-the-environmental-act' THEN '657ec63a7aaf05e4e6b04280'
    ELSE NULL
  END;

-- Update English categories
UPDATE islands
SET island_category_en = standardize_island_category(island_category)
WHERE island_category IS NOT NULL;

-- Update Dhivehi categories
UPDATE islands
SET island_category = get_dhivehi_category(island_category_en)
WHERE island_category_en IS NOT NULL;

-- Add consistency check constraint
ALTER TABLE islands ADD CONSTRAINT check_island_categories
  CHECK (
    (island_category IS NULL AND island_category_en IS NULL) OR
    (island_category IS NOT NULL AND island_category_en IS NOT NULL)
  );