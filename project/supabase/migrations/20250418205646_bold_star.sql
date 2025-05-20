/*
  # Add island category columns to atolls table

  1. Changes
    - Add island_category column to store island category in Dhivehi
    - Add island_category_en column to store island category in English
    
  2. Security
    - Maintains existing RLS policies
*/

-- Add island category columns to atolls table
ALTER TABLE atolls ADD COLUMN IF NOT EXISTS island_category text;
ALTER TABLE atolls ADD COLUMN IF NOT EXISTS island_category_en text;