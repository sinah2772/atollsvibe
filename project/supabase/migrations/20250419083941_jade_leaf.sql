/*
  # Populate Islands Table

  1. Changes
    - Add comprehensive islands data
    - Include proper metadata and references
    
  2. Security
    - Maintains existing RLS policies
*/

-- Insert islands data
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
  -- Male' City islands
  (
    'މާލެ',
    'Male',
    'male',
    'MC001',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ދިވެހިރާއްޖޭގެ ވެރިރަށް މާލެއަކީ ރާއްޖޭގެ އެންމެ ބޮޑު އާބާދީއެއް އޮންނަ ރަށެވެ. މިއީ ރާއްޖޭގެ ވިޔަފާރީގެ، އިޤްތިޞާދީ އަދި ސިޔާސީ ވެރިކަން ހިނގާ މައި މަރުކަޒެވެ.',
    '73° 30'' 32.000" E',
    '4° 10'' 31.000" N',
    'T1',
    '20026',
    1,
    (SELECT id FROM atolls WHERE slug = 'male-city')
  ),
  (
    'ހުޅުމާލެ',
    'Hulhumale',
    'hulhumale',
    'MC002',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ހުޅުމާލެއަކީ މާލޭގެ އާބާދީގެ ތޮއްޖެހުން ކުޑަކުރުމަށް ހިއްކާފައިވާ ރަށެކެވެ. މިއީ ސްމާޓް ސިޓީއެއްގެ ގޮތުގައި ތަރައްޤީކުރަމުންދާ ރަށެކެވެ.',
    '73° 32'' 30.000" E',
    '4° 13'' 15.000" N',
    'T2',
    '23000',
    2,
    (SELECT id FROM atolls WHERE slug = 'male-city')
  ),
  (
    'ވިލިމާލެ',
    'Vilimale',
    'vilimale',
    'MC003',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ވިލިމާލެއަކީ މާލެ ސިޓީގެ އަވަށެކެވެ. މިއީ މާލެއާ ވަރަށް ކައިރީގައި އޮންނަ، މާލޭގެ އާބާދީގެ ބައެއް ދިރިއުޅޭ ރަށެކެވެ.',
    '73° 29'' 15.000" E',
    '4° 10'' 20.000" N',
    'T3',
    '20002',
    3,
    (SELECT id FROM atolls WHERE slug = 'male-city')
  ),

  -- Addu City islands
  (
    'ހިތަދޫ',
    'Hithadhoo',
    'hithadhoo',
    'AC001',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ހިތަދޫއަކީ އައްޑޫ ސިޓީގެ އެންމެ ބޮޑު އާބާދީ އޮންނަ ރަށެވެ. މިއީ ރާއްޖޭގެ އެންމެ ދެކުނުގައި އޮންނަ ސިޓީގެ އިދާރީ ވެރިކަން ހިނގާ ރަށެވެ.',
    '73° 5'' 23.555" E',
    '0° 36'' 29.716" S',
    'S1',
    '19000',
    1,
    (SELECT id FROM atolls WHERE slug = 'addu-city')
  ),
  (
    'މަރަދޫ',
    'Maradhoo',
    'maradhoo',
    'AC002',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'މަރަދޫއަކީ އައްޑޫ ސިޓީގެ މުހިންމު ވިޔަފާރި މަރުކަޒުތަކުގެ ތެރެއިން އެއް މަރުކަޒެވެ.',
    '73° 6'' 45.000" E',
    '0° 37'' 30.000" S',
    'S2',
    '19001',
    2,
    (SELECT id FROM atolls WHERE slug = 'addu-city')
  ),
  (
    'މަރަދޫފޭދޫ',
    'Maradhoo-Feydhoo',
    'maradhoo-feydhoo',
    'AC003',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'މަރަދޫފޭދޫއަކީ މަރަދޫއާއި ފޭދޫއާ ދެމެދުގައި އޮންނަ ރަށެކެވެ.',
    '73° 7'' 15.000" E',
    '0° 38'' 00.000" S',
    'S3',
    '19002',
    3,
    (SELECT id FROM atolls WHERE slug = 'addu-city')
  ),
  (
    'ފޭދޫ',
    'Feydhoo',
    'feydhoo',
    'AC004',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ފޭދޫއަކީ އައްޑޫ ސިޓީގެ މުހިންމު ވިޔަފާރި އަދި ތަޢުލީމީ މަރުކަޒުތައް ހުންނަ ރަށެކެވެ.',
    '73° 8'' 6.593" E',
    '0° 40'' 55.543" S',
    'S4',
    '19003',
    4,
    (SELECT id FROM atolls WHERE slug = 'addu-city')
  ),
  (
    'ހުޅުދޫ',
    'Hulhudhoo',
    'hulhudhoo',
    'AC005',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ހުޅުދޫއަކީ އައްޑޫ ސިޓީގެ އާބާދީ ކުޑަ ރަށްތަކުގެ ތެރެއިން އެއް ރަށެވެ.',
    '73° 4'' 15.000" E',
    '0° 35'' 30.000" S',
    'S5',
    '19004',
    5,
    (SELECT id FROM atolls WHERE slug = 'addu-city')
  ),
  (
    'މީދޫ',
    'Meedhoo',
    'meedhoo',
    'AC006',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'މީދޫއަކީ އައްޑޫ ސިޓީގެ އެންމެ އިރުމަތީގައި އޮންނަ ރަށެވެ. މިއީ ތާރީޚީ ގޮތުން ވަރަށް މުހިންމު ރަށެކެވެ.',
    '73° 9'' 45.000" E',
    '0° 41'' 15.000" S',
    'S6',
    '19005',
    6,
    (SELECT id FROM atolls WHERE slug = 'addu-city')
  ),

  -- Fuvahmulah City
  (
    'ފުވައްމުލައް',
    'Fuvahmulah',
    'fuvahmulah',
    'FC001',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ފުވައްމުލަކަކީ ރާއްޖޭގެ އެއްވަނަ ދަރަޖައިގެ ސިޓީއެކެވެ. މިއީ އަތޮޅެއްގެ ސިފައިގައި އޮންނަ އެންމެ ރަށެކެވެ.',
    '73° 25'' 40.000" E',
    '0° 17'' 55.000" S',
    'Gn1',
    '18000',
    1,
    (SELECT id FROM atolls WHERE slug = 'fuvahmulah-city')
  ),

  -- Kulhudhuffushi City
  (
    'ކުޅުދުއްފުށި',
    'Kulhudhuffushi',
    'kulhudhuffushi',
    'KC001',
    'މީހުން ދިރިއުޅޭ',
    'inhabited',
    'ކުޅުދުއްފުށްޓަކީ ރާއްޖޭގެ އުތުރުގައި އޮންނަ އެންމެ ބޮޑު އާބާދީ އޮންނަ ރަށެވެ. މިއީ އުތުރުގެ ވިޔަފާރީގެ މައި މަރުކަޒެވެ.',
    '73° 4'' 0.000" E',
    '6° 37'' 20.000" N',
    'HDh1',
    '02110',
    1,
    (SELECT id FROM atolls WHERE slug = 'kulhudhuffushi-city')
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