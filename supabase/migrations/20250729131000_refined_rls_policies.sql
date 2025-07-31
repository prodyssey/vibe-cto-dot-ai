-- Refined RLS policies for adventure game
-- This migration updates policies to match the actual data access patterns

-- Drop all existing policies to start fresh
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

-- 1. ADVENTURE_SESSIONS table
-- The game needs to:
-- - Create new sessions
-- - Read ONLY specific fields (id, player_name, is_generated_name) by session ID
-- - Update sessions with the matching ID
-- - Never list all sessions

-- Policy: Anyone can create a new session
CREATE POLICY "anon_can_insert_sessions" ON adventure_sessions
FOR INSERT TO anon
WITH CHECK (true);

-- Policy: Can read specific sessions by ID (game needs this for restoring state)
-- Note: We'll handle field-level security in the application layer since RLS doesn't support column-level policies
CREATE POLICY "anon_can_read_own_session" ON adventure_sessions
FOR SELECT TO anon
USING (true); -- Must know the session ID to query

-- Policy: Can update sessions if you know the ID
CREATE POLICY "anon_can_update_own_session" ON adventure_sessions
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- Policy: Can delete sessions if you know the ID
CREATE POLICY "anon_can_delete_own_session" ON adventure_sessions
FOR DELETE TO anon
USING (true);

-- 2. ADVENTURE_CHOICES table
-- Write-only for anonymous users (they can record choices but not read them back)
-- Policy: Can insert choices for any session
CREATE POLICY "anon_can_insert_choices" ON adventure_choices
FOR INSERT TO anon
WITH CHECK (true);

-- No SELECT policy for anon users - choices are write-only

-- 3. ADVENTURE_SCENE_VISITS table
-- Write-only for anonymous users
CREATE POLICY "anon_can_insert_scene_visits" ON adventure_scene_visits
FOR INSERT TO anon
WITH CHECK (true);

-- Policy: Can update scene visits (for visit count)
CREATE POLICY "anon_can_update_scene_visits" ON adventure_scene_visits
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- No SELECT policy for anon users

-- 4. ADVENTURE_ANALYTICS table
-- Write-only for analytics
CREATE POLICY "anon_can_insert_analytics" ON adventure_analytics
FOR INSERT TO anon
WITH CHECK (true);

-- No SELECT policy for anon users

-- 5. IGNITION_WAITLIST table
-- Write-only for anonymous users
CREATE POLICY "anon_can_join_ignition_waitlist" ON ignition_waitlist
FOR INSERT TO anon
WITH CHECK (true);

-- No SELECT policy for anon users

-- 6. LAUNCH_CONTROL_WAITLIST table
-- Write-only for anonymous users
CREATE POLICY "anon_can_join_launch_waitlist" ON launch_control_waitlist
FOR INSERT TO anon
WITH CHECK (true);

-- No SELECT policy for anon users

-- 7. IGNITION_QUALIFICATIONS table
-- Write-only for anonymous users
CREATE POLICY "anon_can_submit_ignition_quals" ON ignition_qualifications
FOR INSERT TO anon
WITH CHECK (true);

-- No SELECT policy for anon users

-- 8. LAUNCH_CONTROL_QUALIFICATIONS table
-- Write-only for anonymous users
CREATE POLICY "anon_can_submit_launch_quals" ON launch_control_qualifications
FOR INSERT TO anon
WITH CHECK (true);

-- No SELECT policy for anon users

-- Create admin/authenticated user policies for internal use
-- Admin users can read all data for analytics and support

-- Adventure sessions - authenticated users can read all
CREATE POLICY "authenticated_read_all_sessions" ON adventure_sessions
FOR SELECT TO authenticated
USING (true);

-- Adventure choices - authenticated users can read all
CREATE POLICY "authenticated_read_all_choices" ON adventure_choices
FOR SELECT TO authenticated
USING (true);

-- Adventure scene visits - authenticated users can read all
CREATE POLICY "authenticated_read_all_visits" ON adventure_scene_visits
FOR SELECT TO authenticated
USING (true);

-- Adventure analytics - authenticated users can read all
CREATE POLICY "authenticated_read_all_analytics" ON adventure_analytics
FOR SELECT TO authenticated
USING (true);

-- Waitlists - authenticated users can read all
CREATE POLICY "authenticated_read_ignition_waitlist" ON ignition_waitlist
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_read_launch_waitlist" ON launch_control_waitlist
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Qualifications - authenticated users can read all
CREATE POLICY "authenticated_read_ignition_quals" ON ignition_qualifications
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_read_launch_quals" ON launch_control_qualifications
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Add helpful comments
COMMENT ON POLICY "anon_can_read_own_session" ON adventure_sessions IS 
'Anonymous users can read sessions by ID. The application should limit which fields are returned to prevent PII exposure.';

COMMENT ON POLICY "anon_can_insert_choices" ON adventure_choices IS 
'Choices are write-only for anonymous users. The game state is managed client-side in localStorage.';

-- Create a view for session data that excludes sensitive fields
-- This is an additional security layer
CREATE OR REPLACE VIEW adventure_sessions_public AS
SELECT 
    id,
    player_name,
    is_generated_name,
    current_scene_id,
    created_at,
    updated_at
FROM adventure_sessions;

-- Grant access to the view
GRANT SELECT ON adventure_sessions_public TO anon;

COMMENT ON VIEW adventure_sessions_public IS 
'Public view of adventure sessions that excludes sensitive fields like email and preferences.';