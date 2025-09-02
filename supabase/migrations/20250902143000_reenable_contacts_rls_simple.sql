-- Re-enable RLS with the simplest possible working policy
-- Based on the successful pattern from the other tables

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create the most permissive policy first to test
CREATE POLICY "allow_all_anon_inserts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Add authenticated access
CREATE POLICY "allow_authenticated_all" ON contacts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);