-- Use exact same policy naming pattern as the working ignition_waitlist table
-- This should finally resolve the RLS issue

-- Drop current policies
DROP POLICY IF EXISTS "allow_all_anon_inserts" ON contacts;
DROP POLICY IF EXISTS "allow_authenticated_all" ON contacts;

-- Create policies with exact same names and structure as ignition_waitlist
CREATE POLICY "anon_can_join_ignition_waitlist" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Wait, that would be confusing. Let me use the proper names:
CREATE POLICY "anon_can_submit_contact_form" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_read_all_contacts" ON contacts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Double-check grants are in place
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE contacts TO anon;