-- Reset ALL RLS policies to a known working state
-- This will fix both contacts and any other tables that got broken during today's fixes

-- First, drop ALL existing policies on ALL tables to start completely fresh
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Ensure all necessary grants are in place
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE contacts TO anon;
GRANT INSERT ON TABLE ignition_waitlist TO anon;
GRANT INSERT ON TABLE launch_control_waitlist TO anon;
GRANT INSERT ON TABLE community_waitlist TO anon;
GRANT INSERT ON TABLE ignition_qualifications TO anon;
GRANT INSERT ON TABLE launch_control_qualifications TO anon;
GRANT INSERT ON TABLE adventure_sessions TO anon;
GRANT SELECT, UPDATE, DELETE ON TABLE adventure_sessions TO anon;
GRANT INSERT, UPDATE ON TABLE adventure_scene_visits TO anon;
GRANT INSERT ON TABLE adventure_choices TO anon;
GRANT INSERT ON TABLE adventure_analytics TO anon;

-- All tables accessible to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- 1. CONTACTS table - New table, needs simple write-only policy
CREATE POLICY "anon_can_insert_contacts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_read_all_contacts" ON contacts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. IGNITION_WAITLIST table
CREATE POLICY "anon_can_join_ignition_waitlist" ON ignition_waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_read_ignition_waitlist" ON ignition_waitlist
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. LAUNCH_CONTROL_WAITLIST table
CREATE POLICY "anon_can_join_launch_waitlist" ON launch_control_waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_read_launch_waitlist" ON launch_control_waitlist
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. COMMUNITY_WAITLIST table
CREATE POLICY "anon_can_join_community_waitlist" ON community_waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_read_community_waitlist" ON community_waitlist
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. IGNITION_QUALIFICATIONS table
CREATE POLICY "anon_can_submit_ignition_quals" ON ignition_qualifications
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_can_update_ignition_quals" ON ignition_qualifications
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_read_ignition_quals" ON ignition_qualifications
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. LAUNCH_CONTROL_QUALIFICATIONS table
CREATE POLICY "anon_can_submit_launch_quals" ON launch_control_qualifications
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_can_update_launch_quals" ON launch_control_qualifications
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_read_launch_quals" ON launch_control_qualifications
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7. ADVENTURE_SESSIONS table
CREATE POLICY "anon_can_insert_sessions" ON adventure_sessions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_can_read_own_session" ON adventure_sessions
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "anon_can_update_own_session" ON adventure_sessions
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon_can_delete_own_session" ON adventure_sessions
  FOR DELETE TO anon
  USING (true);

CREATE POLICY "authenticated_read_all_sessions" ON adventure_sessions
  FOR SELECT TO authenticated
  USING (true);

-- 8. ADVENTURE_CHOICES table
CREATE POLICY "anon_can_insert_choices" ON adventure_choices
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_read_all_choices" ON adventure_choices
  FOR SELECT TO authenticated
  USING (true);

-- 9. ADVENTURE_SCENE_VISITS table
CREATE POLICY "anon_can_insert_scene_visits" ON adventure_scene_visits
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_can_update_scene_visits" ON adventure_scene_visits
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_read_all_visits" ON adventure_scene_visits
  FOR SELECT TO authenticated
  USING (true);

-- 10. ADVENTURE_ANALYTICS table
CREATE POLICY "anon_can_insert_analytics" ON adventure_analytics
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_read_all_analytics" ON adventure_analytics
  FOR SELECT TO authenticated
  USING (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ignition_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_control_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE ignition_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_control_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventure_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventure_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventure_scene_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventure_analytics ENABLE ROW LEVEL SECURITY;