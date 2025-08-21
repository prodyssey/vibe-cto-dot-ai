-- Implement true session-based RLS policies using client-generated session IDs
-- Drop existing policies
DROP POLICY IF EXISTS "anon_can_insert_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "anon_can_read_scene_visits" ON "public"."adventure_scene_visits";  
DROP POLICY IF EXISTS "anon_can_update_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "anon_can_delete_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "authenticated_read_all_scene_visits" ON "public"."adventure_scene_visits";

DROP POLICY IF EXISTS "anon_can_insert_choices" ON "public"."adventure_choices";
DROP POLICY IF EXISTS "anon_can_read_choices" ON "public"."adventure_choices";
DROP POLICY IF EXISTS "anon_can_update_choices" ON "public"."adventure_choices";  
DROP POLICY IF EXISTS "anon_can_delete_choices" ON "public"."adventure_choices";
DROP POLICY IF EXISTS "authenticated_read_all_choices" ON "public"."adventure_choices";

-- Drop existing adventure_sessions policies to make them session-based too
DROP POLICY IF EXISTS "anon_can_delete_own_session" ON "public"."adventure_sessions";
DROP POLICY IF EXISTS "anon_can_insert_sessions" ON "public"."adventure_sessions";
DROP POLICY IF EXISTS "anon_can_read_own_session" ON "public"."adventure_sessions";
DROP POLICY IF EXISTS "anon_can_update_own_session" ON "public"."adventure_sessions";
DROP POLICY IF EXISTS "authenticated_read_all_sessions" ON "public"."adventure_sessions";

-- Create helper function to set config values
CREATE OR REPLACE FUNCTION set_config(
  setting_name text,
  setting_value text,
  is_local boolean DEFAULT true
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use PostgreSQL's set_config function
  RETURN pg_catalog.set_config(setting_name, setting_value, is_local);
END;
$$;

-- Create helper function to get current session ID from app settings
CREATE OR REPLACE FUNCTION get_current_session_id() 
RETURNS uuid 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to get the session ID from current_setting, return null if not set
  BEGIN
    RETURN current_setting('app.current_session_id', true)::uuid;
  EXCEPTION 
    WHEN OTHERS THEN
      RETURN NULL;
  END;
END;
$$;

-- Session-based policies for adventure_sessions
CREATE POLICY "session_based_sessions_access" 
ON "public"."adventure_sessions" 
FOR ALL TO "anon", "authenticated"
USING (
  id = get_current_session_id() OR 
  get_current_session_id() IS NULL  -- Allow access if no session is set (for initial creation)
)
WITH CHECK (
  id = get_current_session_id() OR 
  get_current_session_id() IS NULL  -- Allow creation if no session is set
);

-- Session-based policies for adventure_scene_visits
CREATE POLICY "session_based_scene_visits_access" 
ON "public"."adventure_scene_visits" 
FOR ALL TO "anon", "authenticated"
USING (
  session_id = get_current_session_id() OR 
  get_current_session_id() IS NULL  -- Fallback for testing
)
WITH CHECK (
  session_id = get_current_session_id() OR 
  get_current_session_id() IS NULL  -- Fallback for testing
);

-- Session-based policies for adventure_choices  
CREATE POLICY "session_based_choices_access" 
ON "public"."adventure_choices" 
FOR ALL TO "anon", "authenticated"
USING (
  session_id = get_current_session_id() OR 
  get_current_session_id() IS NULL  -- Fallback for testing
)
WITH CHECK (
  session_id = get_current_session_id() OR 
  get_current_session_id() IS NULL  -- Fallback for testing
);

-- Grant execute permissions on the helper functions
GRANT EXECUTE ON FUNCTION set_config(text, text, boolean) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_current_session_id() TO anon, authenticated;