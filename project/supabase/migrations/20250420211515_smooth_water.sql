-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- First check if the table exists
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'subcategories') THEN
    -- Then try to drop policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subcategories' AND policyname = 'Subcategories are readable by everyone') THEN
      DROP POLICY "Subcategories are readable by everyone" ON subcategories;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subcategories' AND policyname = 'Only admins can modify subcategories') THEN
      DROP POLICY "Only admins can modify subcategories" ON subcategories;
    END IF;
  END IF;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create subcategories table if it doesn't exist
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subcategories' AND policyname = 'Subcategories are readable by everyone') THEN
    CREATE POLICY "Subcategories are readable by everyone"
      ON subcategories
      FOR SELECT
      TO public
      USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subcategories' AND policyname = 'Only admins can modify subcategories') THEN
    CREATE POLICY "Only admins can modify subcategories"
      ON subcategories
      FOR ALL
      TO authenticated
      USING (
        (SELECT is_admin FROM users WHERE id = auth.uid())
      )
      WITH CHECK (
        (SELECT is_admin FROM users WHERE id = auth.uid())
      );
  END IF;
END $$;

-- Add subcategory_id to articles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'subcategory_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN subcategory_id INTEGER REFERENCES subcategories(id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS subcategories_category_id_idx ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS subcategories_name_idx ON subcategories(name);
CREATE INDEX IF NOT EXISTS subcategories_name_en_idx ON subcategories(name_en);
CREATE INDEX IF NOT EXISTS subcategories_slug_idx ON subcategories(slug);
CREATE INDEX IF NOT EXISTS articles_subcategory_id_idx ON articles(subcategory_id);

-- Insert initial subcategories
INSERT INTO subcategories (name, name_en, slug, category_id)
SELECT s.name, s.name_en, s.slug, c.id
FROM (
  VALUES
    -- Politics subcategories
    ('ސަރުކާރު', 'Government Affairs', 'government-affairs', 'politics'),
    ('އިންތިޚާބު', 'Elections', 'elections', 'politics'),
    ('ޤާނޫނު', 'Legislation', 'legislation', 'politics'),
    ('ޚާރިޖީ ސިޔާސަތު', 'Foreign Policy', 'foreign-policy', 'politics'),
    ('ސިޔާސީ ޕާޓީތައް', 'Political Parties', 'political-parties', 'politics'),
    
    -- Sports subcategories
    ('ފުޓްބޯޅަ', 'Football', 'football', 'sports'),
    ('ބާސްކެޓް', 'Basketball', 'basketball', 'sports'),
    ('ވޮލީ', 'Volleyball', 'volleyball', 'sports'),
    ('ޓެނިސް', 'Tennis', 'tennis', 'sports'),
    ('ބެޑްމިންޓަން', 'Badminton', 'badminton', 'sports'),
    
    -- Technology subcategories
    ('ގެޖެޓް', 'Gadgets', 'gadgets', 'technology'),
    ('އޭ.އައި', 'Artificial Intelligence', 'ai', 'technology'),
    ('ސައިބަރ ސެކިއުރިޓީ', 'Cybersecurity', 'cybersecurity', 'technology'),
    ('ސޯޝަލް މީޑިއާ', 'Social Media', 'social-media', 'technology'),
    ('ޓެކް ކުންފުނިތައް', 'Tech Companies', 'tech-companies', 'technology')
) AS s(name, name_en, slug, category_slug)
JOIN categories c ON c.slug = s.category_slug
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  category_id = EXCLUDED.category_id;