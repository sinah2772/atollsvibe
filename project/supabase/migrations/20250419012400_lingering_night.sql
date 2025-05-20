/*
  # Add Trial Data with Valid Atoll References

  1. Changes
    - Insert sample categories
    - Insert sample news articles with valid atoll IDs
    - Add test users
    
  2. Security
    - Maintains existing RLS policies
*/

-- Insert sample categories if they don't exist
INSERT INTO categories (name, name_en, slug)
VALUES 
  ('ސިޔާސީ', 'Politics', 'politics'),
  ('އިޤްތިޞާދީ', 'Economy', 'economy'),
  ('ކުޅިވަރު', 'Sports', 'sports'),
  ('ވިޔަފާރި', 'Business', 'business'),
  ('ޓެކްނޮލޮޖީ', 'Technology', 'technology')
ON CONFLICT (slug) DO NOTHING;

-- Create test users with different roles
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'author@habaru.mv',
  crypt('author123', gen_salt('bf')),
  now(),
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'author@habaru.mv'
);

-- Insert sample news articles
WITH author_user AS (
  SELECT id FROM auth.users WHERE email = 'author@habaru.mv' LIMIT 1
),
categories_data AS (
  SELECT id, slug FROM categories
),
male_atoll AS (
  SELECT id FROM atolls WHERE slug = 'male-city' LIMIT 1
),
kaafu_atoll AS (
  SELECT id FROM atolls WHERE slug = 'kaafu' LIMIT 1
),
haa_alifu_atoll AS (
  SELECT id FROM atolls WHERE slug = 'haa-alifu' LIMIT 1
),
haa_dhaalu_atoll AS (
  SELECT id FROM atolls WHERE slug = 'haa-dhaalu' LIMIT 1
)
INSERT INTO news_articles (
  title,
  heading,
  social_heading,
  content,
  category_id,
  atoll_ids,
  cover_image,
  image_caption,
  status,
  publish_date,
  user_id,
  news_type,
  news_priority,
  is_breaking,
  is_developing,
  tags,
  meta_keywords
)
SELECT
  -- Breaking News
  'Parliament Approves New Economic Bill',
  'މަޖިލީހުން އާ އިޤްތިޞާދީ ބިލު ފާސްކޮށްފި',
  'އާ އިޤްތިޞާދީ ބިލު ފާސްވެއްޖެ',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Breaking news content here..."}]}]}'::jsonb,
  (SELECT id FROM categories_data WHERE slug = 'economy'),
  ARRAY[(SELECT id FROM male_atoll), (SELECT id FROM kaafu_atoll)],
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
  'Parliament in session',
  'published',
  now() - interval '2 hours',
  (SELECT id FROM author_user),
  'breaking',
  90,
  true,
  false,
  ARRAY['economy', 'parliament', 'legislation'],
  ARRAY['economy', 'bill', 'parliament']
UNION ALL
SELECT
  -- Developing Story
  'Ongoing Rescue Operation in Northern Atolls',
  'އުތުރު އަތޮޅުތަކުގައި ސަލާމަތްކުރުމުގެ މަސައްކަތް ކުރިއަށްދަނީ',
  'ސަލާމަތްކުރުމުގެ މަސައްކަތް ދަނީ ކުރިއަށް',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Developing story content here..."}]}]}'::jsonb,
  (SELECT id FROM categories_data WHERE slug = 'politics'),
  ARRAY[(SELECT id FROM haa_alifu_atoll), (SELECT id FROM haa_dhaalu_atoll)],
  'https://images.pexels.com/photos/1046841/pexels-photo-1046841.jpeg',
  'Rescue operation in progress',
  'published',
  now() - interval '4 hours',
  (SELECT id FROM author_user),
  'developing',
  85,
  false,
  true,
  ARRAY['rescue', 'emergency', 'northern-atolls'],
  ARRAY['rescue', 'emergency', 'operation']
UNION ALL
SELECT
  -- Regular Article
  'National Football Team Prepares for Asian Cup',
  'ޤައުމީ ފުޓްބޯޅަ ޓީމް އޭޝިއަން ކަޕަށް ތައްޔާރުވަނީ',
  'ޤައުމީ ޓީމް އޭޝިއަން ކަޕަށް ތައްޔާރުވަނީ',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Sports article content here..."}]}]}'::jsonb,
  (SELECT id FROM categories_data WHERE slug = 'sports'),
  ARRAY[(SELECT id FROM male_atoll)],
  'https://images.pexels.com/photos/918798/pexels-photo-918798.jpeg',
  'National team training session',
  'published',
  now() - interval '1 day',
  (SELECT id FROM author_user),
  'regular',
  70,
  false,
  false,
  ARRAY['sports', 'football', 'asian-cup'],
  ARRAY['football', 'sports', 'national-team']
UNION ALL
SELECT
  -- Draft Article
  'Tech Startups in Maldives: A Growing Trend',
  'ރާއްޖޭގެ ޓެކް ސްޓާޓްއަޕްތައް: ކުރިއަރަމުންދާ ދާއިރާއެއް',
  'ރާއްޖޭގެ ޓެކް ސްޓާޓްއަޕްތައް އިތުރުވަނީ',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Draft content here..."}]}]}'::jsonb,
  (SELECT id FROM categories_data WHERE slug = 'technology'),
  ARRAY[(SELECT id FROM male_atoll)],
  'https://images.pexels.com/photos/7367/startup-photo.jpg',
  'Tech startup office',
  'draft',
  null,
  (SELECT id FROM author_user),
  'regular',
  60,
  false,
  false,
  ARRAY['technology', 'startups', 'business'],
  ARRAY['tech', 'startups', 'innovation']
UNION ALL
SELECT
  -- Scheduled Article
  'Economic Forecast for 2025',
  '2025 ވަނަ އަހަރުގެ އިޤްތިޞާދީ ލަފާކުރުން',
  '2025 ގެ އިޤްތިޞާދީ ލަފާކުރުން',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Scheduled content here..."}]}]}'::jsonb,
  (SELECT id FROM categories_data WHERE slug = 'economy'),
  ARRAY[(SELECT id FROM male_atoll), (SELECT id FROM kaafu_atoll), (SELECT id FROM haa_alifu_atoll)],
  'https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg',
  'Economic growth chart',
  'scheduled',
  now() + interval '2 days',
  (SELECT id FROM author_user),
  'regular',
  75,
  false,
  false,
  ARRAY['economy', 'forecast', '2025'],
  ARRAY['economy', 'forecast', 'growth'];

-- Update view counts for published articles
UPDATE news_articles 
SET 
  views = floor(random() * 1000 + 100)::integer,
  likes = floor(random() * 100 + 10)::integer,
  comments = floor(random() * 50 + 5)::integer
WHERE status = 'published';