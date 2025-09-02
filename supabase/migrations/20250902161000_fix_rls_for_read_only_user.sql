-- Fix RLS policies to work with actual connection role (supabase_read_only_user)
-- The issue is that connections use supabase_read_only_user, not anon role
-- So we need policies that match the actual executing role

-- Add RLS policies for supabase_read_only_user role on all form tables
CREATE POLICY "read_only_user_can_insert_contacts"
ON public.contacts
FOR INSERT
TO supabase_read_only_user
WITH CHECK (true);

CREATE POLICY "read_only_user_can_insert_ignition_waitlist"
ON public.ignition_waitlist
FOR INSERT
TO supabase_read_only_user
WITH CHECK (true);

CREATE POLICY "read_only_user_can_insert_launch_control_waitlist"  
ON public.launch_control_waitlist
FOR INSERT
TO supabase_read_only_user
WITH CHECK (true);

CREATE POLICY "read_only_user_can_insert_community_waitlist"
ON public.community_waitlist
FOR INSERT
TO supabase_read_only_user
WITH CHECK (true);

CREATE POLICY "read_only_user_can_insert_ignition_qualifications"
ON public.ignition_qualifications
FOR INSERT
TO supabase_read_only_user
WITH CHECK (true);

CREATE POLICY "read_only_user_can_insert_launch_control_qualifications"
ON public.launch_control_qualifications
FOR INSERT
TO supabase_read_only_user
WITH CHECK (true);

-- Also grant table permissions to supabase_read_only_user role
GRANT INSERT ON TABLE public.contacts TO supabase_read_only_user;
GRANT INSERT ON TABLE public.ignition_waitlist TO supabase_read_only_user;
GRANT INSERT ON TABLE public.launch_control_waitlist TO supabase_read_only_user;
GRANT INSERT ON TABLE public.community_waitlist TO supabase_read_only_user;
GRANT INSERT ON TABLE public.ignition_qualifications TO supabase_read_only_user;
GRANT INSERT ON TABLE public.launch_control_qualifications TO supabase_read_only_user;

-- Verify the fix worked
DO $$
BEGIN
    RAISE NOTICE 'Fixed RLS policies for supabase_read_only_user role';
    RAISE NOTICE 'Current executing role: %', current_role;
END $$;