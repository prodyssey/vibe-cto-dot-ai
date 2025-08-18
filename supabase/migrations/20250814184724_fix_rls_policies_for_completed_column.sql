-- Fix RLS policies to allow inserting/updating the completed column

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for anon" ON ignition_qualifications;
DROP POLICY IF EXISTS "Enable insert for anon" ON launch_control_qualifications;
DROP POLICY IF EXISTS "Enable update for anon" ON ignition_qualifications;
DROP POLICY IF EXISTS "Enable update for anon" ON launch_control_qualifications;

-- Enable RLS on both tables (if not already enabled)
ALTER TABLE ignition_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_control_qualifications ENABLE ROW LEVEL SECURITY;

-- Create insert policies that allow anonymous users to insert
CREATE POLICY "Enable insert for anon" ON ignition_qualifications
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Enable insert for anon" ON launch_control_qualifications
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create update policies that allow anonymous users to update their own records
-- Users can update records they created (we'll use a simple true for now since we don't have user auth)
CREATE POLICY "Enable update for anon" ON ignition_qualifications
    FOR UPDATE TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable update for anon" ON launch_control_qualifications
    FOR UPDATE TO anon
    USING (true)
    WITH CHECK (true);

-- Create select policies to allow reading (optional, for debugging)
DROP POLICY IF EXISTS "Enable select for anon" ON ignition_qualifications;
DROP POLICY IF EXISTS "Enable select for anon" ON launch_control_qualifications;

CREATE POLICY "Enable select for anon" ON ignition_qualifications
    FOR SELECT TO anon
    USING (true);

CREATE POLICY "Enable select for anon" ON launch_control_qualifications
    FOR SELECT TO anon
    USING (true);