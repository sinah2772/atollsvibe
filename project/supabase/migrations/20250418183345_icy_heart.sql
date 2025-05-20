/*
  # Add administrator functionality
  
  1. Changes
    - Add admin column to users table
    - Add admin-specific policies for all tables
    
  2. Security
    - Only admins can modify categories and locations
    - Admins can manage all articles
    - Admins can manage other users
*/

-- Add admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update policies for categories
DROP POLICY IF EXISTS "Categories are readable by everyone" ON categories;
CREATE POLICY "Categories are readable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Update policies for locations
DROP POLICY IF EXISTS "Locations are readable by everyone" ON locations;
CREATE POLICY "Locations are readable by everyone"
  ON locations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify locations"
  ON locations
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Add admin policies for articles
CREATE POLICY "Admins can manage all articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Add admin policies for users
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Create the first admin user if it doesn't exist
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
  'admin@habaru.mv',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@habaru.mv'
);

-- Set admin flag for the admin user
UPDATE users
SET is_admin = true
WHERE email = 'admin@habaru.mv';