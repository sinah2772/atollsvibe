/*
  # Fix user signup trigger

  1. Changes
    - Drop existing trigger with CASCADE
    - Recreate trigger function and trigger
    - Ensure proper handling of user data synchronization

  2. Security
    - Maintains existing RLS policies
    - Ensures proper data synchronization between auth and public schemas
*/

-- Drop existing trigger and function with CASCADE to handle dependencies
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.created_at,
    NEW.updated_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();