-- Re-enable RLS on form tables to diagnose the issue properly
-- This restores security while we debug the root cause

-- Re-enable RLS on all form tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ignition_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_control_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE ignition_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_control_qualifications ENABLE ROW LEVEL SECURITY;

-- Clear any existing policies to start fresh for diagnosis
DROP POLICY IF EXISTS "anon_can_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_read_all_contacts" ON contacts;
DROP POLICY IF EXISTS "anon_can_join_ignition_waitlist" ON ignition_waitlist;
DROP POLICY IF EXISTS "authenticated_read_ignition_waitlist" ON ignition_waitlist;

-- Create ONE simple test policy on contacts
CREATE POLICY "test_contacts_insert" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create ONE simple test policy on ignition_waitlist  
CREATE POLICY "test_ignition_insert" ON ignition_waitlist
  FOR INSERT TO anon
  WITH CHECK (true);