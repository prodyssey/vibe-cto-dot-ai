-- Temporarily disable RLS on form tables to verify contact form works
-- This is a temporary measure to get the contact form working while we debug RLS

-- Disable RLS on form tables only (keep adventure game RLS enabled)
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE ignition_waitlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE launch_control_waitlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_waitlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE ignition_qualifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE launch_control_qualifications DISABLE ROW LEVEL SECURITY;

-- Ensure anon has necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE contacts TO anon;
GRANT INSERT ON TABLE ignition_waitlist TO anon;
GRANT INSERT ON TABLE launch_control_waitlist TO anon;
GRANT INSERT ON TABLE community_waitlist TO anon;
GRANT INSERT ON TABLE ignition_qualifications TO anon;
GRANT INSERT, UPDATE ON TABLE ignition_qualifications TO anon;
GRANT INSERT ON TABLE launch_control_qualifications TO anon;
GRANT INSERT, UPDATE ON TABLE launch_control_qualifications TO anon;