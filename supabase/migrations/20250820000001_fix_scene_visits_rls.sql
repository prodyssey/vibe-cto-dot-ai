-- Fix RLS policies for adventure_scene_visits to support upsert operations

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "anon_can_insert_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "anon_can_update_scene_visits" ON "public"."adventure_scene_visits";
DROP POLICY IF EXISTS "authenticated_read_all_visits" ON "public"."adventure_scene_visits";

-- Create comprehensive policies that support both insert and update for upsert
CREATE POLICY "anon_can_manage_scene_visits" 
ON "public"."adventure_scene_visits" 
FOR ALL TO "anon" 
USING (true) 
WITH CHECK (true);

-- Also allow authenticated users full access
CREATE POLICY "authenticated_can_manage_scene_visits" 
ON "public"."adventure_scene_visits" 
FOR ALL TO "authenticated" 
USING (true) 
WITH CHECK (true);

-- Ensure the table has RLS enabled
ALTER TABLE "public"."adventure_scene_visits" ENABLE ROW LEVEL SECURITY;

-- Also fix adventure_choices table to support the new schema
DROP POLICY IF EXISTS "anon_can_insert_choices" ON "public"."adventure_choices";
DROP POLICY IF EXISTS "anon_can_update_choices" ON "public"."adventure_choices";

CREATE POLICY "anon_can_manage_choices" 
ON "public"."adventure_choices" 
FOR ALL TO "anon" 
USING (true) 
WITH CHECK (true);

CREATE POLICY "authenticated_can_manage_choices" 
ON "public"."adventure_choices" 
FOR ALL TO "authenticated" 
USING (true) 
WITH CHECK (true);