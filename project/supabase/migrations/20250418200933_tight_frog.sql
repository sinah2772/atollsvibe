/*
  # Update islands table schema

  1. Changes
     - Adds indexes for faster lookups
     - Adds constraints for data integrity
     - Updates RLS policies for better security

  This migration enhances the islands table with additional indexes and constraints
  to improve performance and data integrity.
*/

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS islands_atoll_id_idx ON islands (atoll_id);
CREATE INDEX IF NOT EXISTS islands_island_category_idx ON islands (island_category);
CREATE INDEX IF NOT EXISTS islands_island_category_en_idx ON islands (island_category_en);

-- Add check constraints for data validation
ALTER TABLE islands ADD CONSTRAINT check_longitude_format 
  CHECK (longitude IS NULL OR longitude ~ '^[0-9]{1,3}° [0-9]{1,2}'' [0-9]{1,2}\.[0-9]{1,3}" [NSEW]$');

ALTER TABLE islands ADD CONSTRAINT check_latitude_format 
  CHECK (latitude IS NULL OR latitude ~ '^[0-9]{1,2}° [0-9]{1,2}'' [0-9]{1,2}\.[0-9]{1,3}" [NSEW]$');

-- Update RLS policies
DROP POLICY IF EXISTS "Islands are readable by everyone" ON islands;
CREATE POLICY "Islands are readable by everyone"
  ON islands
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Only admins can modify islands" ON islands;
CREATE POLICY "Only admins can modify islands"
  ON islands
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );