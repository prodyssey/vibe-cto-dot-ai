-- Fix contacts table RLS policies and permissions
-- This ensures anonymous users can insert contact form submissions

-- Grant necessary permissions to anon role for contacts table
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE contacts TO anon;

-- Drop existing conflicting policies to start fresh  
DROP POLICY IF EXISTS "allow_contact_submissions" ON contacts;
DROP POLICY IF EXISTS "anon_can_submit_contacts" ON contacts; 
DROP POLICY IF EXISTS "Allow public contact form submissions" ON contacts;
DROP POLICY IF EXISTS "Allow public to view contact submissions" ON contacts;

-- Create consistent policies matching the pattern used in other working tables
-- Policy: Anonymous users can insert contact submissions (write-only)
CREATE POLICY "anon_can_insert_contacts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: Authenticated users can read all contacts for admin/analytics purposes
CREATE POLICY "authenticated_read_all_contacts" ON contacts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Add helpful comment
COMMENT ON POLICY "anon_can_insert_contacts" ON contacts IS 
'Anonymous users can submit contact forms but cannot read contact data back (write-only for security).';

COMMENT ON TABLE contacts IS 
'Contact form submissions. RLS enabled with write-only access for anonymous users.';