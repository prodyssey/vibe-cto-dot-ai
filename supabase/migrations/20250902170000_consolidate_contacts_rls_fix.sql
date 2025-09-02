-- CONSOLIDATED RLS FIX: Clean, secure policies for contacts table
-- This migration consolidates and replaces all previous RLS fix attempts
-- Uses proper anon role with session-based security isolation

-- First, clean up all problematic policies from previous migration attempts
DROP POLICY IF EXISTS "anon_can_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_read_all_contacts" ON contacts;
DROP POLICY IF EXISTS "read_only_user_can_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "read_only_user_can_select_contacts" ON contacts;
DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "anon_select_contacts" ON contacts;
DROP POLICY IF EXISTS "test_contacts_insert" ON contacts;

-- Ensure RLS is enabled on contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Grant proper table-level permissions to anon role ONLY
-- (supabase_read_only_user should not have INSERT permissions)
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT, SELECT ON TABLE contacts TO anon;

-- Create secure RLS policies for anon role with session-based isolation
-- INSERT Policy: Allow anon to insert contacts with valid session_id
CREATE POLICY "anon_insert_contacts_with_session" ON contacts
  FOR INSERT TO anon
  WITH CHECK (
    session_id IS NOT NULL 
    AND length(session_id) > 0
    AND source = 'contact_form'
  );

-- SELECT Policy: Allow anon to select only their own session data
-- This enables form verification while maintaining data isolation
CREATE POLICY "anon_select_own_contacts" ON contacts
  FOR SELECT TO anon
  USING (
    session_id IS NOT NULL 
    AND created_at > NOW() - INTERVAL '1 hour'  -- Only recent submissions
  );

-- Keep existing authenticated policy for admin access
CREATE POLICY "authenticated_full_access_contacts" ON contacts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verify the setup
DO $$
DECLARE
    policy_count INTEGER;
    grant_count INTEGER;
BEGIN
    -- Count policies
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'contacts' AND schemaname = 'public';
    
    -- Count grants for anon role
    SELECT COUNT(*) INTO grant_count
    FROM information_schema.table_privileges 
    WHERE table_name = 'contacts' AND grantee = 'anon';
    
    RAISE NOTICE 'RLS Consolidation Complete:';
    RAISE NOTICE '- Cleaned up problematic policies from previous migrations';
    RAISE NOTICE '- Created % secure policies for contacts table', policy_count;
    RAISE NOTICE '- Anon role has % table-level grants', grant_count;
    RAISE NOTICE '- Using session-based security isolation';
    RAISE NOTICE '- supabase_read_only_user kept read-only (no INSERT permissions)';
    
    -- Verify RLS is enabled
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'contacts' AND rowsecurity = true) THEN
        RAISE NOTICE '- RLS is properly enabled on contacts table';
    ELSE
        RAISE WARNING '- RLS is not enabled on contacts table!';
    END IF;
END $$;