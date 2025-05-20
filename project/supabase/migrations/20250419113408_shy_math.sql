/*
  # Fix Authentication Setup

  1. Changes
    - Create users table first before referencing it
    - Set up proper permissions and triggers
    - Create test users
*/

-- Enable auth schema extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table first
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Ensure proper auth schema permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, anon, authenticated;

-- Ensure proper public schema permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated;

-- Drop and recreate the trigger function for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

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

-- Create RLS policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (is_admin = true)
  WITH CHECK (is_admin = true);

-- Create test users for development
DO $$
BEGIN
  -- Create author user if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'author@habaru.mv') THEN
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
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'author@habaru.mv',
      crypt('author123', gen_salt('bf')),
      now(),
      now(),
      now()
    );
  END IF;

  -- Create editor user if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'editor@habaru.mv') THEN
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
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'editor@habaru.mv',
      crypt('editor123', gen_salt('bf')),
      now(),
      now(),
      now()
    );
  END IF;
END $$;

-- Set editor as admin
UPDATE users
SET is_admin = true
WHERE email = 'editor@habaru.mv';