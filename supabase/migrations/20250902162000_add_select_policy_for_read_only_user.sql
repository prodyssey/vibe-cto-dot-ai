-- Add missing SELECT policies for supabase_read_only_user role
-- This fixes the issue where inserts succeed but tests fail because they can't read back the data

-- Add SELECT policy for supabase_read_only_user on contacts table
CREATE POLICY "read_only_user_can_select_contacts" ON "public"."contacts"
AS PERMISSIVE FOR SELECT
TO supabase_read_only_user
USING (true);

-- Add SELECT policies for other form tables as well for consistency
CREATE POLICY "read_only_user_can_select_ignition_waitlist" ON "public"."ignition_waitlist"
AS PERMISSIVE FOR SELECT
TO supabase_read_only_user
USING (true);

CREATE POLICY "read_only_user_can_select_launch_control_waitlist" ON "public"."launch_control_waitlist"
AS PERMISSIVE FOR SELECT
TO supabase_read_only_user
USING (true);

CREATE POLICY "read_only_user_can_select_community_waitlist" ON "public"."community_waitlist"
AS PERMISSIVE FOR SELECT
TO supabase_read_only_user
USING (true);

CREATE POLICY "read_only_user_can_select_ignition_qualifications" ON "public"."ignition_qualifications"
AS PERMISSIVE FOR SELECT
TO supabase_read_only_user
USING (true);

CREATE POLICY "read_only_user_can_select_launch_control_qualifications" ON "public"."launch_control_qualifications"
AS PERMISSIVE FOR SELECT
TO supabase_read_only_user
USING (true);

-- Also grant SELECT permissions at table level
GRANT SELECT ON TABLE public.contacts TO supabase_read_only_user;
GRANT SELECT ON TABLE public.ignition_waitlist TO supabase_read_only_user;
GRANT SELECT ON TABLE public.launch_control_waitlist TO supabase_read_only_user;
GRANT SELECT ON TABLE public.community_waitlist TO supabase_read_only_user;
GRANT SELECT ON TABLE public.ignition_qualifications TO supabase_read_only_user;
GRANT SELECT ON TABLE public.launch_control_qualifications TO supabase_read_only_user;

-- Verify the fix
DO $$
BEGIN
    RAISE NOTICE 'Added SELECT policies and permissions for supabase_read_only_user';
    RAISE NOTICE 'This should fix E2E test failures due to inability to verify inserted data';
END $$;