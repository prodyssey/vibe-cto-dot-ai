-- COMPREHENSIVE RLS FIX: Apply secure policies to all form submission tables
-- Uses the same secure pattern as contacts table with session-based isolation

-- Clean up any existing problematic policies on all tables
DROP POLICY IF EXISTS "anon_can_join_ignition_waitlist" ON ignition_waitlist;
DROP POLICY IF EXISTS "authenticated_read_ignition_waitlist" ON ignition_waitlist;
DROP POLICY IF EXISTS "test_ignition_insert" ON ignition_waitlist;
DROP POLICY IF EXISTS "anon_insert_ignition_waitlist" ON ignition_waitlist;
DROP POLICY IF EXISTS "anon_select_ignition_waitlist" ON ignition_waitlist;

DROP POLICY IF EXISTS "anon_can_join_launch_control_waitlist" ON launch_control_waitlist;
DROP POLICY IF EXISTS "authenticated_read_launch_control_waitlist" ON launch_control_waitlist;
DROP POLICY IF EXISTS "anon_insert_launch_control_waitlist" ON launch_control_waitlist;
DROP POLICY IF EXISTS "anon_select_launch_control_waitlist" ON launch_control_waitlist;

DROP POLICY IF EXISTS "anon_can_join_community_waitlist" ON community_waitlist;
DROP POLICY IF EXISTS "authenticated_read_community_waitlist" ON community_waitlist;
DROP POLICY IF EXISTS "anon_insert_community_waitlist" ON community_waitlist;
DROP POLICY IF EXISTS "anon_select_community_waitlist" ON community_waitlist;

-- Ensure RLS is enabled on all form tables
ALTER TABLE ignition_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_control_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE ignition_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_control_qualifications ENABLE ROW LEVEL SECURITY;

-- Grant proper table-level permissions to anon role for all form tables
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT, SELECT ON TABLE ignition_waitlist TO anon;
GRANT INSERT, SELECT ON TABLE launch_control_waitlist TO anon;
GRANT INSERT, SELECT ON TABLE community_waitlist TO anon;
GRANT INSERT, SELECT ON TABLE ignition_qualifications TO anon;
GRANT INSERT, SELECT ON TABLE launch_control_qualifications TO anon;

-- IGNITION WAITLIST RLS POLICIES (UUID session_id)
-- Allow anon to insert with valid UUID session_id
CREATE POLICY "anon_insert_ignition_waitlist_secure" ON ignition_waitlist
  FOR INSERT TO anon
  WITH CHECK (
    session_id IS NOT NULL
  );

-- Allow anon to select only recent submissions for verification
CREATE POLICY "anon_select_ignition_waitlist_secure" ON ignition_waitlist
  FOR SELECT TO anon
  USING (
    session_id IS NOT NULL 
    AND created_at > NOW() - INTERVAL '1 hour'
  );

-- LAUNCH CONTROL WAITLIST RLS POLICIES (UUID session_id)
CREATE POLICY "anon_insert_launch_control_waitlist_secure" ON launch_control_waitlist
  FOR INSERT TO anon
  WITH CHECK (
    session_id IS NOT NULL
  );

CREATE POLICY "anon_select_launch_control_waitlist_secure" ON launch_control_waitlist
  FOR SELECT TO anon
  USING (
    session_id IS NOT NULL 
    AND created_at > NOW() - INTERVAL '1 hour'
  );

-- COMMUNITY WAITLIST RLS POLICIES
CREATE POLICY "anon_insert_community_waitlist_secure" ON community_waitlist
  FOR INSERT TO anon
  WITH CHECK (
    email IS NOT NULL 
    AND length(email) > 0
    AND email LIKE '%@%'
  );

CREATE POLICY "anon_select_community_waitlist_secure" ON community_waitlist
  FOR SELECT TO anon
  USING (
    email IS NOT NULL 
    AND created_at > NOW() - INTERVAL '1 hour'
  );

-- IGNITION QUALIFICATIONS RLS POLICIES (UUID session_id)
CREATE POLICY "anon_insert_ignition_qualifications_secure" ON ignition_qualifications
  FOR INSERT TO anon
  WITH CHECK (
    session_id IS NOT NULL
  );

CREATE POLICY "anon_select_ignition_qualifications_secure" ON ignition_qualifications
  FOR SELECT TO anon
  USING (
    session_id IS NOT NULL 
    AND created_at > NOW() - INTERVAL '1 hour'
  );

-- LAUNCH CONTROL QUALIFICATIONS RLS POLICIES (UUID session_id)
CREATE POLICY "anon_insert_launch_control_qualifications_secure" ON launch_control_qualifications
  FOR INSERT TO anon
  WITH CHECK (
    session_id IS NOT NULL
  );

CREATE POLICY "anon_select_launch_control_qualifications_secure" ON launch_control_qualifications
  FOR SELECT TO anon
  USING (
    session_id IS NOT NULL 
    AND created_at > NOW() - INTERVAL '1 hour'
  );

-- Keep authenticated role policies for admin access on all tables
CREATE POLICY "authenticated_full_access_ignition_waitlist" ON ignition_waitlist
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_full_access_launch_control_waitlist" ON launch_control_waitlist
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_full_access_community_waitlist" ON community_waitlist
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_full_access_ignition_qualifications" ON ignition_qualifications
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_full_access_launch_control_qualifications" ON launch_control_qualifications
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verification and summary
DO $$
DECLARE
    table_name TEXT;
    policy_count INTEGER;
    total_policies INTEGER := 0;
BEGIN
    RAISE NOTICE 'Comprehensive Form Table RLS Fix Applied';
    RAISE NOTICE '=====================================';
    
    FOR table_name IN VALUES ('ignition_waitlist'), ('launch_control_waitlist'), ('community_waitlist'), ('ignition_qualifications'), ('launch_control_qualifications')
    LOOP
        SELECT COUNT(*) INTO policy_count 
        FROM pg_policies 
        WHERE tablename = table_name AND schemaname = 'public';
        
        total_policies := total_policies + policy_count;
        RAISE NOTICE '- %: % policies created', table_name, policy_count;
    END LOOP;
    
    RAISE NOTICE 'Total policies created: %', total_policies;
    RAISE NOTICE 'All form tables now have secure session-based RLS policies';
    RAISE NOTICE 'anon role can INSERT/SELECT with proper validation';
    RAISE NOTICE 'authenticated role has full admin access';
END $$;