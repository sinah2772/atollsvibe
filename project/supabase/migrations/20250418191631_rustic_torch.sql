/*
  # Rename locations table to atolls

  1. Changes
    - Rename locations table to atolls
    - Update foreign key references
    
  2. Security
    - Preserve existing RLS policies
*/

-- Rename the table
ALTER TABLE locations RENAME TO atolls;

-- Update sequence if it exists
ALTER SEQUENCE IF EXISTS locations_id_seq RENAME TO atolls_id_seq;

-- Update indexes
ALTER INDEX IF EXISTS locations_pkey RENAME TO atolls_pkey;
ALTER INDEX IF EXISTS locations_slug_key RENAME TO atolls_slug_key;

-- Update RLS policies
ALTER POLICY "Locations are readable by everyone" ON atolls RENAME TO "Atolls are readable by everyone";
ALTER POLICY "Only admins can modify locations" ON atolls RENAME TO "Only admins can modify atolls";