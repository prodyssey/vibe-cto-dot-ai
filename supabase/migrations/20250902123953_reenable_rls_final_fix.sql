-- Re-enable RLS on contacts table with working policy
-- This addresses the security vulnerability of having RLS disabled

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON contacts TO anon;

-- Create a working RLS policy for contact form submissions  
CREATE POLICY "allow_contact_submissions" ON contacts
  FOR INSERT
  WITH CHECK (true);