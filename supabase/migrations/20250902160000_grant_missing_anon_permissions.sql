-- Grant missing table permissions to anon role
-- The RLS policies exist but table-level grants are missing
-- This is why both E2E tests and direct tests fail with 42501 RLS errors

-- Grant schema usage to anon role
GRANT USAGE ON SCHEMA public TO anon;

-- Grant INSERT permissions on all form tables to anon role
GRANT INSERT ON TABLE public.contacts TO anon;
GRANT INSERT ON TABLE public.ignition_waitlist TO anon;
GRANT INSERT ON TABLE public.launch_control_waitlist TO anon;
GRANT INSERT ON TABLE public.community_waitlist TO anon;
GRANT INSERT ON TABLE public.ignition_qualifications TO anon;
GRANT INSERT ON TABLE public.launch_control_qualifications TO anon;

-- Verify permissions were granted (for debugging)
-- This will show in logs that permissions are now in place
DO $$
BEGIN
    RAISE NOTICE 'Checking anon permissions after grant...';
    
    -- Check if INSERT permission exists on contacts
    IF EXISTS (
        SELECT 1 FROM information_schema.table_privileges 
        WHERE table_name = 'contacts' 
        AND grantee = 'anon' 
        AND privilege_type = 'INSERT'
    ) THEN
        RAISE NOTICE 'SUCCESS: anon role has INSERT permission on contacts table';
    ELSE
        RAISE NOTICE 'WARNING: anon role still missing INSERT permission on contacts table';
    END IF;
END $$;