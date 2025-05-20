/*
  # Fix Islands Table Schema

  1. Changes
    - Drop and recreate islands table with proper constraints
    - Add proper indexes for performance
    - Set up RLS policies
    
  2. Security
    - Maintain existing RLS policies
    - Ensure proper cascade behavior
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS islands CASCADE;

-- Create islands table with proper relationships
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
  atoll_id integer REFERENCES atolls(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX islands_atoll_id_idx ON islands(atoll_id);
CREATE INDEX islands_list_order_idx ON islands(list_order);
CREATE INDEX islands_slug_idx ON islands(slug);

-- Enable Row Level Security
ALTER TABLE islands ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Islands are readable by everyone"
  ON islands
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify islands"
  ON islands
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Insert sample data
INSERT INTO islands (
  name, 
  name_en, 
  slug, 
  island_code,
  island_category,
  island_category_en,
  island_details,
  longitude,
  latitude,
  election_commission_code,
  list_order,
  atoll_id
)
SELECT
  'މާލެ',
  'Male',
  'male',
  'MC001',
  'މީހުން ދިރިއުޅޭ',
  'inhabited',
  'ދިވެހިރާއްޖޭގެ ވެރިރަށް',
  '73° 30'' 34.249" E',
  '4° 10'' 27.299" N',
  'T1',
  1,
  (SELECT id FROM atolls WHERE slug = 'male-city')
WHERE NOT EXISTS (
  SELECT 1 FROM islands WHERE slug = 'male'
);

-- Add check constraints for data validation
ALTER TABLE islands 
  ADD CONSTRAINT check_longitude_format 
    CHECK (longitude IS NULL OR longitude ~ '^[0-9]{1,3}°\s[0-9]{1,2}''\s[0-9]{1,2}\.[0-9]{3}"\s[NSEW]$'),
  ADD CONSTRAINT check_latitude_format 
    CHECK (latitude IS NULL OR latitude ~ '^[0-9]{1,2}°\s[0-9]{1,2}''\s[0-9]{1,2}\.[0-9]{3}"\s[NSEW]$'),
  ADD CONSTRAINT check_island_category 
    CHECK (
      island_category_en IN (
        'inhabited',
        'uninhabited',
        'resort',
        'industrial',
        'airport',
        'agricultural'
      )
    );