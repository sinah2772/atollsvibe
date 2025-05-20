/*
  # Update locations table

  1. Changes
    - Add new locations with proper metadata
    - Each location includes:
      - Name in Thaana and English
      - Slug for URL routing
      - Creation timestamp

  2. Security
    - Uses existing RLS policies
*/

INSERT INTO locations (name, name_en, slug, created_at)
VALUES
  ('އައްޑޫ ސިޓީ', 'Addu City', 'addu-city', now()),
  ('އއ. އަތޮޅު', 'Alifu Alifu', 'alifu-alifu', now()),
  ('އދ. އަތޮޅު', 'Alifu Dhaalu', 'alifu-dhaalu', now()),
  ('ބ. އަތޮޅު', 'Baa', 'baa', now()),
  ('ދ. އަތޮޅު', 'Dhaalu', 'dhaalu', now()),
  ('ފ. އަތޮޅު', 'Faafu', 'faafu', now()),
  ('ޏ. އަތޮޅު', 'Fuvahmulah City', 'fuvahmulah-city', now()),
  ('ގއ. އަތޮޅު', 'Gaafu Alifu', 'gaafu-alifu', now()),
  ('ގދ. އަތޮޅު', 'Gaafu Dhaalu', 'gaafu-dhaalu', now()),
  ('ހއ. އަތޮޅު', 'Haa Alifu', 'haa-alifu', now()),
  ('ހދ. އަތޮޅު', 'Haa Dhaalu', 'haa-dhaalu', now()),
  ('ކ. އަތޮޅު', 'Kaafu', 'kaafu', now()),
  ('ކުޅުދުއްފުށި ސިޓީ', 'Kulhudhuffushi City', 'kulhudhuffushi-city', now()),
  ('ލ. އަތޮޅު', 'Laamu', 'laamu', now()),
  ('ޅ. އަތޮޅު', 'Lhaviyani', 'lhaviyani', now()),
  ('މާލެ ސިޓީ', 'Male City', 'male-city', now()),
  ('މ. އަތޮޅު', 'Meemu', 'meemu', now()),
  ('ނ. އަތޮޅު', 'Noonu', 'noonu', now()),
  ('ރ. އަތޮޅު', 'Raa', 'raa', now()),
  ('ށ. އަތޮޅު', 'Shaviyani', 'shaviyani', now()),
  ('ތ. އަތޮޅު', 'Thaa', 'thaa', now()),
  ('ވ. އަތޮޅު', 'Vaavu', 'vaavu', now())
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en;