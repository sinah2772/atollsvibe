/*
  # Articles Schema

  1. New Tables
    - articles
      - id (uuid, primary key) 
      - title (text) - Latin title
      - heading (text) - Thaana heading
      - social_heading (text) - Social media heading
      - content (jsonb) - Article content in TipTap JSON format
      - category_id (int) - Foreign key to categories
      - location_id (int) - Foreign key to locations
      - cover_image (text) - URL to cover image
      - image_caption (text) - Cover image caption
      - status (text) - draft/published/scheduled
      - publish_date (timestamptz) - When to publish
      - views (int) - View count
      - likes (int) - Like count
      - comments (int) - Comment count
      - user_id (uuid) - Foreign key to auth.users
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - categories
      - id (int, primary key)
      - name (text) - Thaana name
      - name_en (text) - English name
      - slug (text) - URL friendly name
      - created_at (timestamptz)
    
    - locations  
      - id (int, primary key)
      - name (text) - Thaana name
      - name_en (text) - English name
      - slug (text) - URL friendly name
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create articles table
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  heading text NOT NULL,
  social_heading text,
  content jsonb NOT NULL DEFAULT '{}',
  category_id integer NOT NULL,
  location_id integer NOT NULL,
  cover_image text,
  image_caption text,
  status text NOT NULL DEFAULT 'draft',
  publish_date timestamptz,
  views integer NOT NULL DEFAULT 0,
  likes integer NOT NULL DEFAULT 0,
  comments integer NOT NULL DEFAULT 0,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create locations table
CREATE TABLE locations (
  id serial PRIMARY KEY,
  name text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Policies for articles
CREATE POLICY "Users can read published articles"
  ON articles
  FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can create articles"
  ON articles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own articles"
  ON articles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own articles"
  ON articles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for categories
CREATE POLICY "Categories are readable by everyone"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for locations
CREATE POLICY "Locations are readable by everyone"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial categories
INSERT INTO categories (name, name_en, slug) VALUES
  ('ކުޅިވަރު', 'Sports', 'sports'),
  ('ދުނިޔެ', 'World', 'world'),
  ('ވިޔަފާރި', 'Business', 'business'),
  ('ކޮލަމް', 'Column', 'column'),
  ('ލުއި ޚަބަރު', 'Light News', 'light-news'),
  ('ރިޕޯޓު', 'Report', 'report'),
  ('ރާއްޖެ', 'Maldives', 'maldives'),
  ('ވާހަކަ', 'Story', 'story'),
  ('ސިއްހަތު', 'Health', 'health'),
  ('އިސްލާމް', 'Islam', 'islam'),
  ('ދިވެހި ބަސް', 'Dhivehi Language', 'dhivehi'),
  ('ލައިފް ސްޓައިލް', 'Lifestyle', 'lifestyle'),
  ('ފިލްމާއި މިޔުޒިކް', 'Film & Music', 'film-music'),
  ('ޖޯކު', 'Jokes', 'jokes'),
  ('ހިޔާނާތުގެ ހިޔާ', 'Shadow of Betrayal', 'betrayal'),
  ('މީހުން', 'People', 'people'),
  ('ދީނީ ވާހަކަ', 'Religious Stories', 'religious');

-- Insert initial locations
INSERT INTO locations (name, name_en, slug) VALUES
  ('އައްޑޫ ސިޓީ', 'Addu City', 'addu-city'),
  ('ކ. މާލެ', 'K. Male', 'male'),
  ('ނޫނު އަތޮޅު', 'Noon Atoll', 'noon-atoll');