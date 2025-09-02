-- Re-enable RLS and create proper policies for both anon and authenticated users
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can insert contact form submissions" ON contacts;

-- Create policies for both anon and authenticated roles
CREATE POLICY "Allow contact form submissions" ON contacts
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);