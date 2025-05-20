/*
  # Fix Authentication Schema Setup

  1. Changes
    - Enable auth schema extensions if not already enabled
    - Ensure auth schema exists
    - Grant necessary permissions to authenticated and anon roles
    
  2. Security
    - Maintains existing RLS policies
    - Adds proper authentication schema permissions
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Ensure foreign key permissions
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_id_fkey,
  ADD CONSTRAINT users_id_fkey 
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;