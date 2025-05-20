/*
  # Fix Authentication and Permissions

  1. Changes
    - Add role-based permissions system
    - Fix user authentication and session handling
    - Add helper functions for permission checks in RLS policies
    
  2. Security
    - Improve RLS policies with permission checks
    - Add proper cascade behavior for related tables
*/

-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create role_permissions junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

-- Add role_id to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role_id'
  ) THEN
    ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_role_id_idx ON users(role_id);
CREATE INDEX IF NOT EXISTS role_permissions_role_id_idx ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS role_permissions_permission_id_idx ON role_permissions(permission_id);

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create helper function for permission checks
CREATE OR REPLACE FUNCTION has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_perm BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN role_permissions rp ON u.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = auth.uid() AND p.name = permission_name
  ) INTO has_perm;
  
  -- Also return true if user is admin
  IF NOT has_perm THEN
    SELECT is_admin INTO has_perm FROM users WHERE id = auth.uid();
  END IF;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies for roles
CREATE POLICY "Roles are viewable by everyone"
  ON roles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only users with manage permission can modify roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (has_permission('users.manage_all'))
  WITH CHECK (has_permission('users.manage_all'));

-- Create RLS policies for permissions
CREATE POLICY "Permissions are viewable by everyone"
  ON permissions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only users with manage permission can modify permissions"
  ON permissions
  FOR ALL
  TO authenticated
  USING (has_permission('users.manage_all'))
  WITH CHECK (has_permission('users.manage_all'));

-- Create RLS policies for role_permissions
CREATE POLICY "Role permissions are viewable by everyone"
  ON role_permissions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only users with manage permission can modify role permissions"
  ON role_permissions
  FOR ALL
  TO authenticated
  USING (has_permission('users.manage_all'))
  WITH CHECK (has_permission('users.manage_all'));

-- Update RLS policies for users
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;

CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING ((auth.uid() = id) OR has_permission('users.read_all'));

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING ((has_permission('users.update_own') AND (auth.uid() = id)) OR has_permission('users.manage_all'))
  WITH CHECK ((has_permission('users.update_own') AND (auth.uid() = id)) OR has_permission('users.manage_all'));

CREATE POLICY "Users with manage permission can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (has_permission('users.manage_all'))
  WITH CHECK (has_permission('users.manage_all'));

-- Update RLS policies for articles
DROP POLICY IF EXISTS "Users can read published articles" ON articles;
DROP POLICY IF EXISTS "Users can create articles" ON articles;
DROP POLICY IF EXISTS "Users can update own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete own articles" ON articles;
DROP POLICY IF EXISTS "Admins can manage all articles" ON articles;

CREATE POLICY "Anyone can read published articles"
  ON articles
  FOR SELECT
  TO public
  USING ((status = 'published') AND (publish_date <= now()));

CREATE POLICY "Users can read their own articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING ((auth.uid() = user_id));

CREATE POLICY "Users with create permission can create articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (has_permission('articles.create') AND (auth.uid() = user_id));

CREATE POLICY "Users can update their own articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING ((has_permission('articles.update_own') AND (auth.uid() = user_id)) OR has_permission('articles.manage_all'))
  WITH CHECK ((has_permission('articles.update_own') AND (auth.uid() = user_id)) OR has_permission('articles.manage_all'));

CREATE POLICY "Users can delete their own articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING ((has_permission('articles.delete_own') AND (auth.uid() = user_id)) OR has_permission('articles.manage_all'));

-- Insert default roles if they don't exist
INSERT INTO roles (name, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('editor', 'Can manage content but not users'),
  ('author', 'Can create and manage own content'),
  ('reader', 'Basic user with limited permissions')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions if they don't exist
INSERT INTO permissions (name, description, resource, action)
VALUES
  -- User permissions
  ('users.read_all', 'Can read all user data', 'users', 'read_all'),
  ('users.update_own', 'Can update own user data', 'users', 'update_own'),
  ('users.manage_all', 'Can manage all users', 'users', 'manage_all'),
  
  -- Article permissions
  ('articles.create', 'Can create articles', 'articles', 'create'),
  ('articles.read_all', 'Can read all articles including drafts', 'articles', 'read_all'),
  ('articles.update_own', 'Can update own articles', 'articles', 'update_own'),
  ('articles.delete_own', 'Can delete own articles', 'articles', 'delete_own'),
  ('articles.manage_all', 'Can manage all articles', 'articles', 'manage_all')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
WITH 
  admin_role AS (SELECT id FROM roles WHERE name = 'admin'),
  editor_role AS (SELECT id FROM roles WHERE name = 'editor'),
  author_role AS (SELECT id FROM roles WHERE name = 'author'),
  reader_role AS (SELECT id FROM roles WHERE name = 'reader')
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM (
  -- Admin has all permissions
  SELECT 'admin' as role, p.id as permission_id FROM permissions p
  UNION ALL
  -- Editor permissions
  SELECT 'editor', p.id FROM permissions p WHERE p.name IN (
    'articles.create', 'articles.read_all', 'articles.update_own', 
    'articles.delete_own', 'articles.manage_all'
  )
  UNION ALL
  -- Author permissions
  SELECT 'author', p.id FROM permissions p WHERE p.name IN (
    'articles.create', 'articles.update_own', 'articles.delete_own'
  )
  UNION ALL
  -- Reader permissions
  SELECT 'reader', p.id FROM permissions p WHERE p.name IN (
    'users.update_own'
  )
) AS perms
JOIN roles r ON perms.role = r.name
JOIN permissions p ON perms.permission_id = p.id
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Set admin user role
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'admin')
WHERE email = 'admin@habaru.mv';

-- Set author user role
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'author')
WHERE email = 'author@habaru.mv';

-- Set editor user role
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'editor')
WHERE email = 'editor@habaru.mv';

-- Add onboarding_completed column to users if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add preferred_categories column to users if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'preferred_categories'
  ) THEN
    ALTER TABLE users ADD COLUMN preferred_categories TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Add preferred_islands column to users if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'preferred_islands'
  ) THEN
    ALTER TABLE users ADD COLUMN preferred_islands TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Add preferred_language column to users if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE users ADD COLUMN preferred_language TEXT DEFAULT 'dv';
  END IF;
END $$;

-- Add notification_preferences column to users if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE users ADD COLUMN notification_preferences JSONB DEFAULT '{"push": false, "email": true}';
  END IF;
END $$;

-- Add user_type column to users if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE users ADD COLUMN user_type TEXT DEFAULT 'reader';
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_onboarding_idx ON users(onboarding_completed);
CREATE INDEX IF NOT EXISTS users_user_type_idx ON users(user_type);