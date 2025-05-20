-- Enable storage extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create storage.buckets table
CREATE TABLE IF NOT EXISTS storage.buckets (
  id text PRIMARY KEY,
  name text NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  public boolean DEFAULT false,
  avif_autodetection boolean DEFAULT false,
  file_size_limit bigint,
  allowed_mime_types text[]
);

-- Create storage.objects table
CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bucket_id text REFERENCES storage.buckets,
  name text NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED
);

-- Set up RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop bucket policies
  DROP POLICY IF EXISTS "Public buckets are viewable by everyone" ON storage.buckets;
  DROP POLICY IF EXISTS "Users can create buckets" ON storage.buckets;
  DROP POLICY IF EXISTS "Users can update their own buckets" ON storage.buckets;
  DROP POLICY IF EXISTS "Users can delete their own buckets" ON storage.buckets;
  
  -- Drop object policies
  DROP POLICY IF EXISTS "Public bucket objects are viewable by everyone" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload to public buckets" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own objects" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own objects" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies for buckets
CREATE POLICY "Public buckets are viewable by everyone"
  ON storage.buckets
  FOR SELECT
  USING (public = true);

CREATE POLICY "Users can create buckets"
  ON storage.buckets
  FOR INSERT
  TO authenticated
  WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can update their own buckets"
  ON storage.buckets
  FOR UPDATE
  TO authenticated
  USING (owner = auth.uid());

CREATE POLICY "Users can delete their own buckets"
  ON storage.buckets
  FOR DELETE
  TO authenticated
  USING (owner = auth.uid());

-- Create policies for objects
CREATE POLICY "Public bucket objects are viewable by everyone"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id IN (
      SELECT id FROM storage.buckets WHERE public = true
    )
  );

CREATE POLICY "Users can upload to public buckets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN (
      SELECT id FROM storage.buckets WHERE public = true
    )
  );

CREATE POLICY "Users can update their own objects"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (owner = auth.uid());

CREATE POLICY "Users can delete their own objects"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (owner = auth.uid());

-- Create buckets for different content types
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES 
  (
    'images',
    'Images',
    true,
    ARRAY[
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/avif'
    ],
    52428800  -- 50MB
  ),
  (
    'documents',
    'Documents',
    false,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ],
    104857600  -- 100MB
  ),
  (
    'videos',
    'Videos',
    true,
    ARRAY[
      'video/mp4',
      'video/webm',
      'video/ogg'
    ],
    524288000  -- 500MB
  ),
  (
    'audio',
    'Audio',
    true,
    ARRAY[
      'audio/mpeg',
      'audio/ogg',
      'audio/wav',
      'audio/webm'
    ],
    52428800  -- 50MB
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  file_size_limit = EXCLUDED.file_size_limit;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bname_idx ON storage.buckets (name);
CREATE INDEX IF NOT EXISTS objects_bucket_id_idx ON storage.objects (bucket_id);
CREATE INDEX IF NOT EXISTS objects_name_idx ON storage.objects (name);
CREATE INDEX IF NOT EXISTS objects_owner_idx ON storage.objects (owner);
CREATE INDEX IF NOT EXISTS objects_created_at_idx ON storage.objects (created_at DESC);

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_storage_buckets_updated_at ON storage.buckets;
DROP TRIGGER IF EXISTS update_storage_objects_updated_at ON storage.objects;

-- Create or replace function to update updated_at
CREATE OR REPLACE FUNCTION storage.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_storage_buckets_updated_at
  BEFORE UPDATE ON storage.buckets
  FOR EACH ROW
  EXECUTE PROCEDURE storage.update_updated_at_column();

CREATE TRIGGER update_storage_objects_updated_at
  BEFORE UPDATE ON storage.objects
  FOR EACH ROW
  EXECUTE PROCEDURE storage.update_updated_at_column();