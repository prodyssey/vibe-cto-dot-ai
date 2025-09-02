-- Final fix for anon role permissions
-- Both contacts and ignition_waitlist are failing RLS for anon role
-- Need to ensure anon role has proper table grants and working RLS policies

-- Grant schema usage to anon role
GRANT USAGE ON SCHEMA public TO anon;

-- Grant table permissions to anon role for all form tables
GRANT INSERT, SELECT ON TABLE public.contacts TO anon;
GRANT INSERT, SELECT ON TABLE public.ignition_waitlist TO anon;
GRANT INSERT, SELECT ON TABLE public.launch_control_waitlist TO anon;
GRANT INSERT, SELECT ON TABLE public.community_waitlist TO anon;
GRANT INSERT, SELECT ON TABLE public.ignition_qualifications TO anon;
GRANT INSERT, SELECT ON TABLE public.launch_control_qualifications TO anon;

-- Recreate RLS policies for anon role to ensure they work
-- Drop existing policies first
DROP POLICY IF EXISTS "anon_can_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "anon_can_join_ignition_waitlist" ON ignition_waitlist;

-- Create fresh policies for anon role
CREATE POLICY "anon_insert_contacts" ON public.contacts
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_select_contacts" ON public.contacts
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "anon_insert_ignition_waitlist" ON public.ignition_waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_select_ignition_waitlist" ON public.ignition_waitlist
  FOR SELECT TO anon
  USING (true);

-- Ensure RLS is enabled on both tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ignition_waitlist ENABLE ROW LEVEL SECURITY;

-- Test the fix with diagnostic info
DO $$
BEGIN
    RAISE NOTICE 'Fixed anon role permissions and recreated RLS policies';
    RAISE NOTICE 'Granted INSERT/SELECT on form tables to anon role';
    RAISE NOTICE 'Created fresh RLS policies for anon role on contacts and ignition_waitlist';
END $$;