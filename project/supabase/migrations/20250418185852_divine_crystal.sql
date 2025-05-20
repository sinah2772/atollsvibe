/*
  # Add location tags

  1. New Tables
    - `location_tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `name_en` (text)
      - `slug` (text, unique)
      - `collection_id` (text)
      - `item_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `published_at` (timestamp)
      - `news` (text)
      - `island_reference` (text)
      - `flag` (text)
      - `url` (text)
      - `margin_top` (text)
      - `position` (text)
      - `width` (text)
      - `popup` (text)

  2. Security
    - Enable RLS on `location_tags` table
    - Add policies for public read access
    - Add policies for admin-only modifications
*/

-- Create location_tags table
CREATE TABLE IF NOT EXISTS location_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text NOT NULL,
  slug text UNIQUE NOT NULL,
  collection_id text,
  item_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  news text,
  island_reference text,
  flag text,
  url text,
  margin_top text,
  position text,
  width text,
  popup text
);

-- Enable RLS
ALTER TABLE location_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Location tags are readable by everyone"
  ON location_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify location tags"
  ON location_tags
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Insert initial data
INSERT INTO location_tags (
  name, name_en, slug, collection_id, item_id, 
  island_reference, flag, url, width, margin_top
)
VALUES
  ('އއ. އަތޮޅު', 'Alifu Alifu', 'alifu-alifu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04119',
   'fusfinolhu; gaagandu-96ecd; kandholhudhoo-5b489; velifinolhu-e6f81; vihamaafaru; mathivereefinolhu; madivarufinolhu; madivaru-23ecb; maagau; gaathafushi; fushi; mushimasmigili; etheremadivaru; dhinnolhufinolhu; veligandu-5b705; velidhoo-02413; alikoirah; maayafushi; kudafolhudhoo; kuramathi; madoogali; halaveli; gangehi; ellaidhoo; bathalaa-1c404; fesdhoo; feridhoo; maalhos-e0ca5; himendhoo; bodufolhudhoo; mathiveri; ukulhas; thoddoo; rasdhoo',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a4baef363ecd6e6a2136_alif-alif.svg',
   NULL,
   'width: 6.3em; margin-top: 2.3em; margin-left: 60.1em',
   NULL),
  
  ('އދ. އަތޮޅު', 'Alifu Dhaalu', 'alifu-dhaalu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b0424c',
   'lonuboi; theluveligaa; kudadhoo-0cf8a; tholhifushi; kalhahandhihuraa; innafushi-f81e7; hukurudhoo; huruelhi; hurasdhoo; hiyafushi; fushidhigga; heenfaru; dhiggiri; enboodhoo-51737; bodufinolhu-964eb; bodukaashihuraa; vilamendhoo; bulhalhohi; maafushivaru; vakarufalhi; thundufushi; nalaguraidhoo; moofushi; rangaleefinolhu; vilingilivaru; mirihi; kudarah; mahchafushi; huvahendhoo; dhiffushi-c6fd1; angaagau; athurugau; dhihdhoofinolhu; ariyadhoo; maamingili-76591; dhihdhoo-802f8; fenfushi-dc36a; dhigurah-c8ccc; dhangethi; mandhoo; mahibadhoo; kunburudhoo-7bbf9; omadhoo; rangali; hangnaameedhoo',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/668448b04fa983f7c2d2aeac_alif-dhaal.svg',
   'http://habaru.webflow.io/atolls/alifu-dhaalu',
   'width: 6.6em; margin-top: 1.9em; margin-left: 53.6em',
   NULL),

  ('ވ. އަތޮޅު', 'Vaavu', 'vaavu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04246',
   'hingaakulheefinolhu; kuda-anbaraa; hurahufinolhu; rahgandu; vattaru; vashugiri; thunduhuraa; hulhidhoo; kudhiboli; ruhhurihuraa; aarah-0fbb8; fohtheyobodufushi; dhiggiri-9035f; alimathaa; bodumohoraa; keyodhoo-b6a7c; anbaraa; rakeedhoo; felidhoo; thinadhoo; fulidhoo',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a5a8136cc1016db97094_vaau.svg',
   NULL,
   'width: 5.9em; margin-top: 9.5em; margin-left: 49.9em',
   NULL)
ON CONFLICT (slug) DO NOTHING;