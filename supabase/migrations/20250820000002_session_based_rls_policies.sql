-- Fix RLS policies to match the existing pattern used by adventure_sessions
-- Drop all existing policies to recreate them properly
DROP POLICY IF EXISTS "anon_can_manage_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "authenticated_can_manage_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "anon_can_manage_choices" ON "public"."adventure_choices";
DROP POLICY IF EXISTS "authenticated_can_manage_choices" ON "public"."adventure_choices";

-- Also drop any pre-existing policies that might conflict
DROP POLICY IF EXISTS "anon_can_insert_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "anon_can_read_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "anon_can_update_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "anon_can_delete_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "authenticated_read_all_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "authenticated_read_all_visits" ON "public"."adventure_scene_visits";

DROP POLICY IF EXISTS "anon_can_insert_choices" ON "public"."adventure_choices";
DROP POLICY IF EXISTS "anon_can_read_choices" ON "public"."adventure_choices";
DROP POLICY IF EXISTS "anon_can_update_choices" ON "public"."adventure_choices";
DROP POLICY IF EXISTS "anon_can_delete_choices" ON "public"."adventure_choices";
DROP POLICY IF EXISTS "authenticated_read_all_choices" ON "public"."adventure_choices";

-- Create policies that match the adventure_sessions pattern
-- For adventure_scene_visits
CREATE POLICY "anon_can_insert_scene_visits" ON "public"."adventure_scene_visits" FOR INSERT TO "anon" WITH CHECK (true);
CREATE POLICY "anon_can_read_scene_visits" ON "public"."adventure_scene_visits" FOR SELECT TO "anon" USING (true);
CREATE POLICY "anon_can_update_scene_visits" ON "public"."adventure_scene_visits" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);
CREATE POLICY "anon_can_delete_scene_visits" ON "public"."adventure_scene_visits" FOR DELETE TO "anon" USING (true);
CREATE POLICY "authenticated_read_all_scene_visits" ON "public"."adventure_scene_visits" FOR SELECT TO "authenticated" USING (true);

-- For adventure_choices  
CREATE POLICY "anon_can_insert_choices" ON "public"."adventure_choices" FOR INSERT TO "anon" WITH CHECK (true);
CREATE POLICY "anon_can_read_choices" ON "public"."adventure_choices" FOR SELECT TO "anon" USING (true);
CREATE POLICY "anon_can_update_choices" ON "public"."adventure_choices" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);
CREATE POLICY "anon_can_delete_choices" ON "public"."adventure_choices" FOR DELETE TO "anon" USING (true);
CREATE POLICY "authenticated_read_all_choices" ON "public"."adventure_choices" FOR SELECT TO "authenticated" USING (true);

-- Note: These policies currently allow access to all records (USING (true)) 
-- which matches the existing adventure_sessions pattern. 
-- If you want true session-based security, we would need to modify all tables 
-- to use something like: USING (session_id = current_setting('app.current_session_id')::uuid)