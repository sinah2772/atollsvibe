/*
  # Add multiple atolls support to articles

  1. Changes
    - Add atoll_ids column to articles table to support multiple atoll selections
    - Set default as empty array
*/

ALTER TABLE articles ADD COLUMN atoll_ids integer[] DEFAULT '{}';