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
  postal_code,
  list_order,
  atoll_id
)
VALUES
  -- Haa Alifu Atoll islands
  (
    'ތުރާކުނު',
    'Thuraakunu',
    'thuraakunu',
    'HA001',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ތުރާކުނަކީ ރާއްޖޭގެ އެންމެ އުތުރުގައި އޮންނަ މީހުން ދިރިއުޅޭ ރަށެވެ.',
    '72° 54'' 45.000" E',
    '7° 6'' 15.000" N',
    'HA1',
    '02100',
    1,
    (SELECT id FROM atolls WHERE slug = 'haa-alifu')
  ),
  (
    'އުލިގަމު',
    'Uligamu',
    'uligamu',
    'HA002',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'އުލިގަމަކީ ހއ. އަތޮޅުގެ އުތުރު ސަރަޙައްދުގައި އޮންނަ ރަށެކެވެ.',
    '73° 0'' 30.000" E',
    '7° 5'' 15.000" N',
    'HA2',
    '02101',
    2,
    (SELECT id FROM atolls WHERE slug = 'haa-alifu')
  ),
  (
    'މުލައްދޫ',
    'Mulhadhoo',
    'mulhadhoo',
    'HA003',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'މުލައްދޫއަކީ ހއ. އަތޮޅުގެ އުތުރު ސަރަޙައްދުގައި އޮންނަ ރަށެކެވެ.',
    '73° 1'' 45.000" E',
    '7° 4'' 30.000" N',
    'HA3',
    '02102',
    3,
    (SELECT id FROM atolls WHERE slug = 'haa-alifu')
  ),
  (
    'ހޯރަފުށި',
    'Hoarafushi',
    'hoarafushi',
    'HA004',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ހޯރަފުށްޓަކީ ހއ. އަތޮޅުގެ އާބާދީ ބޮޑު ރަށްތަކުގެ ތެރެއިން އެއް ރަށެވެ.',
    '73° 7'' 45.000" E',
    '7° 3'' 45.000" N',
    'HA4',
    '02103',
    4,
    (SELECT id FROM atolls WHERE slug = 'haa-alifu')
  ),

  -- Haa Dhaalu Atoll islands
  (
    'ހަނިމާދޫ',
    'Hanimaadhoo',
    'hanimaadhoo',
    'HDh001',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ހަނިމާދޫއަކީ ރާއްޖޭގެ އުތުރުގައި އޮންނަ އިންޓަރނޭޝަނަލް އެއަރޕޯޓް އޮންނަ ރަށެވެ.',
    '73° 10'' 15.000" E',
    '6° 45'' 0.000" N',
    'HDh1',
    '02120',
    1,
    (SELECT id FROM atolls WHERE slug = 'haa-dhaalu')
  ),
  (
    'ފިނޭ',
    'Finey',
    'finey',
    'HDh002',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ފިނޭއަކީ ހދ. އަތޮޅުގެ މީހުން ދިރިއުޅޭ ރަށެކެވެ.',
    '73° 8'' 45.000" E',
    '6° 44'' 15.000" N',
    'HDh2',
    '02121',
    2,
    (SELECT id FROM atolls WHERE slug = 'haa-dhaalu')
  ),
  (
    'ނައިވާދޫ',
    'Naivaadhoo',
    'naivaadhoo',
    'HDh003',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ނައިވާދޫއަކީ ހދ. އަތޮޅުގެ މީހުން ދިރިއުޅޭ ރަށެކެވެ.',
    '73° 7'' 30.000" E',
    '6° 43'' 30.000" N',
    'HDh3',
    '02122',
    3,
    (SELECT id FROM atolls WHERE slug = 'haa-dhaalu')
  ),
  (
    'ހިރިމަރަދޫ',
    'Hirimaradhoo',
    'hirimaradhoo',
    'HDh004',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ހިރިމަރަދޫއަކީ ހދ. އަތޮޅުގެ މީހުން ދިރިއުޅޭ ރަށެކެވެ.',
    '73° 6'' 15.000" E',
    '6° 42'' 45.000" N',
    'HDh4',
    '02123',
    4,
    (SELECT id FROM atolls WHERE slug = 'haa-dhaalu')
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  island_code = EXCLUDED.island_code,
  island_category = EXCLUDED.island_category,
  island_category_en = EXCLUDED.island_category_en,
  island_details = EXCLUDED.island_details,
  longitude = EXCLUDED.longitude,
  latitude = EXCLUDED.latitude,
  election_commission_code = EXCLUDED.election_commission_code,
  postal_code = EXCLUDED.postal_code,
  list_order = EXCLUDED.list_order,
  atoll_id = EXCLUDED.atoll_id;

-- Update Hanimaadhoo to include airport category
UPDATE islands 
SET 
  island_category = 'މީހުން ދިރިއުޅޭ',
  island_category_en = 'inhabited'
WHERE slug = 'hanimaadhoo';