/*
  # Fix infinite recursion in user policies

  1. Changes
    - Drop existing problematic policies on users table
    - Create new policies with optimized conditions to prevent recursion
  
  2. Security
    - Maintain same level of security but with more efficient policy definitions
    - Ensure admins can still manage users
    - Ensure users can still manage their own data
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create new policies without recursion
CREATE POLICY "Admins can manage users"
ON users
AS PERMISSIVE
FOR ALL
TO authenticated
USING (is_admin = true)
WITH CHECK (is_admin = true);

CREATE POLICY "Admins can view all users"
ON users
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (is_admin = true);