-- Grant proper table permissions to anon role for contacts table
-- The E2E tests revealed that RLS policies exist but table grants are missing

-- Grant schema usage to anon role  
GRANT USAGE ON SCHEMA public TO anon;

-- Grant INSERT permission on contacts table to anon role
GRANT INSERT ON TABLE contacts TO anon;

-- Verify RLS is enabled (should already be enabled)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Double-check that our RLS policies exist
-- (They should already exist from previous migration)
DO $$
BEGIN
    -- Check if INSERT policy exists, create if not
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'anon_can_insert_contacts'
    ) THEN
        CREATE POLICY "anon_can_insert_contacts" ON contacts
          FOR INSERT TO anon
          WITH CHECK (true);
    END IF;

    -- Check if authenticated policy exists, create if not
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'authenticated_read_all_contacts'
    ) THEN
        CREATE POLICY "authenticated_read_all_contacts" ON contacts
          FOR ALL TO authenticated
          USING (true)
          WITH CHECK (true);
    END IF;
END $$;