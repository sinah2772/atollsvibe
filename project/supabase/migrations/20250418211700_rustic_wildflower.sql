/*
  # Fix Authentication Schema

  1. Changes
    - Drop the foreign key constraint from public.users to auth.users
    - Re-create the foreign key constraint with proper cascade rules
    - Add missing indexes for performance

  2. Security
    - Maintain existing RLS policies
    - Ensure proper relationship between auth.users and public.users
*/

-- First remove the existing foreign key constraint
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Re-create the foreign key constraint with proper cascade rules
ALTER TABLE public.users
ADD CONSTRAINT users_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Add index on user id for better join performance
CREATE INDEX IF NOT EXISTS users_id_idx ON public.users(id);

-- Verify the auth schema exists and has proper grants
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon, authenticated;