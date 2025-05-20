/*
  # Update Categories

  1. Changes
    - Drop existing categories
    - Add comprehensive news categories with Dhivehi and English names
    
  2. Security
    - Maintains existing RLS policies
*/

-- First drop existing categories
TRUNCATE categories CASCADE;

-- Insert new categories
INSERT INTO categories (name, name_en, slug)
VALUES 
  ('ސިޔާސީ', 'Politics', 'politics'),
  ('އިޤްތިޞާދީ', 'Business & Economy', 'business-economy'),
  ('ޓެކްނޮލޮޖީ', 'Technology', 'technology'),
  ('ސައިންސް', 'Science', 'science'),
  ('ޞިއްޙީ', 'Health & Medicine', 'health-medicine'),
  ('ތިމާވެށި', 'Environment', 'environment'),
  ('ތަޢުލީމީ', 'Education', 'education'),
  ('ކުޅިވަރު', 'Sports', 'sports'),
  ('މުނިފޫހިފިލުވުން', 'Entertainment & Arts', 'entertainment-arts'),
  ('ބައިނަލްއަޤްވާމީ', 'World News', 'world-news'),
  ('ރާއްޖެ', 'National News', 'national-news'),
  ('ޖިނާއީ', 'Crime & Justice', 'crime-justice'),
  ('ދިރިއުޅުން', 'Lifestyle', 'lifestyle'),
  ('ޚިޔާލު', 'Opinion & Editorial', 'opinion-editorial'),
  ('މޫސުން', 'Weather', 'weather'),
  ('އިޖްތިމާޢީ', 'Community', 'community');