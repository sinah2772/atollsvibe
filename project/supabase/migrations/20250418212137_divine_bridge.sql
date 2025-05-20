/*
  # Fix Authentication Schema and User Management

  1. Changes
    - Drop and recreate users table with proper constraints
    - Update trigger function for user management
    - Set up proper permissions and policies
    
  2. Security
    - Ensure proper cascade behavior
    - Add necessary indexes
    - Set up RLS policies
*/

-- First drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop dependent policies first
DROP POLICY IF EXISTS "Only admins can modify categories" ON categories;
DROP POLICY IF EXISTS "Only admins can modify atolls" ON atolls;
DROP POLICY IF EXISTS "Admins can manage all articles" ON articles;

-- Now we can safely drop and recreate the users table
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_id_idx ON public.users(id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

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
UPDATE public.users
SET is_admin = true
WHERE email = 'admin@habaru.mv';

-- Recreate the dependent policies
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

CREATE POLICY "Only admins can modify atolls"
  ON atolls
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

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