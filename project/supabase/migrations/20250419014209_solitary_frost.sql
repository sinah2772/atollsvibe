/*
  # Create islands table

  1. New Table
    - `islands`
      - `id` (integer, primary key)
      - `name` (text, not null)
      - `name_en` (text, not null)
      - `slug` (text, not null, unique)
      - `island_code` (text)
      - `island_category` (text)
      - `island_category_en` (text)
      - `island_details` (text)
      - `longitude` (text)
      - `latitude` (text)
      - `election_commission_code` (text)
      - `postal_code` (text)
      - `other_name_en` (text)
      - `other_name_dv` (text)
      - `list_order` (integer)
      - `atoll_id` (integer, foreign key references atolls)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `islands` table
    - Add policy for public read access
    - Add policy for admin management

  3. Indexes
    - Primary key on id
    - Index on atoll_id for foreign key performance
    - Index on list_order for sorting performance
    - Unique index on slug
*/

-- Create the islands table
CREATE TABLE IF NOT EXISTS islands (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    name_en text NOT NULL,
    slug text NOT NULL UNIQUE,
    island_code text,
    island_category text,
    island_category_en text,
    island_details text,
    longitude text,
    latitude text,
    election_commission_code text,
    postal_code text,
    other_name_en text,
    other_name_dv text,
    list_order integer,
    atoll_id integer REFERENCES atolls(id),
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS islands_atoll_id_idx ON islands(atoll_id);
CREATE INDEX IF NOT EXISTS islands_list_order_idx ON islands(list_order);

-- Enable Row Level Security
ALTER TABLE islands ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Islands are readable by everyone"
    ON islands
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Only admins can modify islands"
    ON islands
    USING (
        (SELECT is_admin FROM users WHERE id = auth.uid())
    )
    WITH CHECK (
        (SELECT is_admin FROM users WHERE id = auth.uid())
    );