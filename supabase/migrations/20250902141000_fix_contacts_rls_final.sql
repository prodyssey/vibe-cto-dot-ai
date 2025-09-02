-- Fix contacts table RLS policies completely
-- This ensures the policies work exactly like the other working tables

-- Temporarily disable RLS to clean up
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "anon_can_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_read_all_contacts" ON contacts;
DROP POLICY IF EXISTS "allow_contact_submissions" ON contacts;
DROP POLICY IF EXISTS "anon_can_submit_contacts" ON contacts; 
DROP POLICY IF EXISTS "Allow public contact form submissions" ON contacts;
DROP POLICY IF EXISTS "Allow public to view contact submissions" ON contacts;

-- Ensure proper grants (re-grant to be sure)
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE contacts TO anon;

-- Re-enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create the exact same policy structure as the working tables
-- Policy 1: Anonymous users can insert (write-only)
CREATE POLICY "anon_can_insert_contacts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy 2: Authenticated users can do everything (admin access)
CREATE POLICY "authenticated_read_all_contacts" ON contacts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON POLICY "anon_can_insert_contacts" ON contacts IS 
'Anonymous users can submit contact forms but cannot read contact data back (write-only for security).';

COMMENT ON TABLE contacts IS 
'Contact form submissions. RLS enabled with write-only access for anonymous users, matching other form tables.';