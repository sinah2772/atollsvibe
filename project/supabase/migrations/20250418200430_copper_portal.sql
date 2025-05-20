/*
  # Create Islands Table

  1. New Tables
    - `islands`
      - `id` (integer, primary key)
      - `name` (text, not null)
      - `name_en` (text, not null)
      - `slug` (text, unique, not null)
      - `island_code` (text)
      - `island_category` (text)
      - `island_category_en` (text)
      - `island_details` (text)
      - `longitude` (text)
      - `latitude` (text)
      - `election_commission_code` (text)
      - `postal_code` (text)
      - `other_name_en` (text)
      - `other_name_dv` (text)
      - `list_order` (integer)
      - `atoll_id` (integer, foreign key)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `islands` table
    - Add policy for public to read islands
    - Add policy for admins to modify islands
*/

-- Create islands table
CREATE TABLE IF NOT EXISTS islands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  island_code TEXT,
  island_category TEXT,
  island_category_en TEXT,
  island_details TEXT,
  longitude TEXT,
  latitude TEXT,
  election_commission_code TEXT,
  postal_code TEXT,
  other_name_en TEXT,
  other_name_dv TEXT,
  list_order INTEGER,
  atoll_id INTEGER REFERENCES atolls(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

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
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );