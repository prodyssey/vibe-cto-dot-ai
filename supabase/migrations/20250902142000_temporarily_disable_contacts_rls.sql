-- Temporarily disable RLS on contacts to test if basic insert works
-- This is for debugging purposes only

-- Disable RLS temporarily
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Drop all policies 
DROP POLICY IF EXISTS "anon_can_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_read_all_contacts" ON contacts;

-- Ensure grants are in place
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE contacts TO anon;
GRANT SELECT ON TABLE contacts TO authenticated;