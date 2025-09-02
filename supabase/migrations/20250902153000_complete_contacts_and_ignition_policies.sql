-- Complete the RLS policies for contacts and ignition_waitlist
-- Replace test policies with proper comprehensive policies

-- Remove test policies  
DROP POLICY "test_contacts_insert" ON contacts;
DROP POLICY "test_ignition_insert" ON ignition_waitlist;

-- Add proper contacts policies (matching the pattern of other working tables)
CREATE POLICY "anon_can_insert_contacts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_read_all_contacts" ON contacts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add proper ignition_waitlist policies (matching the pattern of other working tables)
CREATE POLICY "anon_can_join_ignition_waitlist" ON ignition_waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_read_ignition_waitlist" ON ignition_waitlist
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);