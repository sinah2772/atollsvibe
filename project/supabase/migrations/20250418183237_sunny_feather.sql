/*
  # Set up database schema

  1. New Tables
    - `categories`
      - `id` (integer, primary key)
      - `name` (text) - name in Thaana
      - `name_en` (text) - name in English
      - `slug` (text, unique) - URL-friendly identifier
      - `created_at` (timestamptz)

    - `locations`
      - `id` (integer, primary key)
      - `name` (text) - name in Thaana
      - `name_en` (text) - name in English
      - `slug` (text, unique) - URL-friendly identifier
      - `created_at` (timestamptz)

    - `articles`
      - `id` (uuid, primary key)
      - `title` (text) - title in Latin
      - `heading` (text) - heading in Thaana
      - `social_heading` (text, nullable) - social media heading
      - `content` (jsonb) - article content
      - `category_id` (integer) - foreign key to categories
      - `location_id` (integer) - foreign key to locations
      - `cover_image` (text, nullable)
      - `image_caption` (text, nullable)
      - `status` (text) - draft/published/scheduled
      - `publish_date` (timestamptz, nullable)
      - `views` (integer)
      - `likes` (integer)
      - `comments` (integer)
      - `user_id` (uuid) - foreign key to users
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Set up appropriate access policies
*/

DO $$ 
BEGIN
  -- Create categories table if it doesn't exist
  CREATE TABLE IF NOT EXISTS categories (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    name_en text NOT NULL,
    slug text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
  );

  -- Enable RLS and create policy if it doesn't exist
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Categories are readable by everyone'
  ) THEN
    CREATE POLICY "Categories are readable by everyone"
      ON categories
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Create locations table if it doesn't exist
  CREATE TABLE IF NOT EXISTS locations (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    name_en text NOT NULL,
    slug text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
  );

  -- Enable RLS and create policy if it doesn't exist
  ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Locations are readable by everyone'
  ) THEN
    CREATE POLICY "Locations are readable by everyone"
      ON locations
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Create articles table if it doesn't exist
  CREATE TABLE IF NOT EXISTS articles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    heading text NOT NULL,
    social_heading text,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    category_id integer NOT NULL REFERENCES categories(id),
    location_id integer NOT NULL REFERENCES locations(id),
    cover_image text,
    image_caption text,
    status text DEFAULT 'draft' NOT NULL,
    publish_date timestamptz,
    views integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    comments integer DEFAULT 0 NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
  );

  -- Enable RLS and create policies if they don't exist
  ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Users can create articles'
  ) THEN
    CREATE POLICY "Users can create articles"
      ON articles
      FOR INSERT
      TO public
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Users can read published articles'
  ) THEN
    CREATE POLICY "Users can read published articles"
      ON articles
      FOR SELECT
      TO public
      USING ((status = 'published') OR (auth.uid() = user_id));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Users can update own articles'
  ) THEN
    CREATE POLICY "Users can update own articles"
      ON articles
      FOR UPDATE
      TO public
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Users can delete own articles'
  ) THEN
    CREATE POLICY "Users can delete own articles"
      ON articles
      FOR DELETE
      TO public
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Insert initial data if tables are empty
INSERT INTO categories (name, name_en, slug)
SELECT name, name_en, slug
FROM (VALUES
  ('ސިޔާސީ', 'Politics', 'politics'),
  ('އިޤްތިޞާދީ', 'Economy', 'economy'),
  ('ކުޅިވަރު', 'Sports', 'sports'),
  ('ވިޔަފާރި', 'Business', 'business'),
  ('ޓެކްނޮލޮޖީ', 'Technology', 'technology')
) AS v(name, name_en, slug)
WHERE NOT EXISTS (SELECT 1 FROM categories);

INSERT INTO locations (name, name_en, slug)
SELECT name, name_en, slug
FROM (VALUES
  ('މާލެ', 'Male', 'male'),
  ('އައްޑޫ', 'Addu', 'addu'),
  ('ފުވައްމުލައް', 'Fuvahmulah', 'fuvahmulah'),
  ('ކުޅުދުއްފުށި', 'Kulhudhuffushi', 'kulhudhuffushi'),
  ('ތިލަދުންމަތި', 'Thiladhunmathi', 'thiladhunmathi')
) AS v(name, name_en, slug)
WHERE NOT EXISTS (SELECT 1 FROM locations);