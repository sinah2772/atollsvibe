/*
  # Update island categories in atolls table

  1. Changes
    - Update the island_category and island_category_en columns with appropriate values
    - Categories are based on the administrative and geographical classification of atolls
    
  2. Security
    - Maintains existing RLS policies
*/

-- Update island categories for all atolls
UPDATE atolls 
SET 
  island_category = 'އަތޮޅު',
  island_category_en = 'Atoll'
WHERE slug IN (
  'alifu-alifu', 'alifu-dhaalu', 'baa', 'dhaalu', 'faafu', 
  'gaafu-alifu', 'gaafu-dhaalu', 'haa-alifu', 'haa-dhaalu', 
  'kaafu', 'laamu', 'lhaviyani', 'meemu', 'noonu', 
  'raa', 'shaviyani', 'thaa', 'vaavu'
);

-- Update island categories for cities
UPDATE atolls 
SET 
  island_category = 'ސިޓީ',
  island_category_en = 'City'
WHERE slug IN (
  'addu-city', 'fuvahmulah-city', 'kulhudhuffushi-city', 'male-city'
);