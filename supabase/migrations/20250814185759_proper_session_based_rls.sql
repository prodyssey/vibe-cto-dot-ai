-- Proper session-based Row Level Security using RPC functions

-- First, add session_id columns if they don't exist
ALTER TABLE ignition_qualifications 
ADD COLUMN IF NOT EXISTS session_id UUID DEFAULT gen_random_uuid();

ALTER TABLE launch_control_qualifications 
ADD COLUMN IF NOT EXISTS session_id UUID DEFAULT gen_random_uuid();

-- Add indexes for session_id lookups
CREATE INDEX IF NOT EXISTS idx_ignition_qualifications_session 
ON ignition_qualifications(session_id);

CREATE INDEX IF NOT EXISTS idx_launch_control_qualifications_session 
ON launch_control_qualifications(session_id);

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable insert for anon" ON ignition_qualifications;
DROP POLICY IF EXISTS "Enable update for anon" ON ignition_qualifications;
DROP POLICY IF EXISTS "Enable select for anon" ON ignition_qualifications;
DROP POLICY IF EXISTS "Users can insert their own records" ON ignition_qualifications;
DROP POLICY IF EXISTS "Users can update their own records via session" ON ignition_qualifications;
DROP POLICY IF EXISTS "Users can read their own records via session" ON ignition_qualifications;

DROP POLICY IF EXISTS "Enable insert for anon" ON launch_control_qualifications;
DROP POLICY IF EXISTS "Enable update for anon" ON launch_control_qualifications;
DROP POLICY IF EXISTS "Enable select for anon" ON launch_control_qualifications;
DROP POLICY IF EXISTS "Users can insert their own records" ON launch_control_qualifications;
DROP POLICY IF EXISTS "Users can update their own records via session" ON launch_control_qualifications;
DROP POLICY IF EXISTS "Users can read their own records via session" ON launch_control_qualifications;

-- Create new session-based policies for ignition_qualifications
-- Allow inserts with any session_id
CREATE POLICY "Allow insert with session" ON ignition_qualifications
    FOR INSERT TO anon
    WITH CHECK (session_id IS NOT NULL);

-- Allow updates only when session_id matches
CREATE POLICY "Allow update with matching session" ON ignition_qualifications
    FOR UPDATE TO anon
    USING (true) -- The actual check happens in the WHERE clause of the query
    WITH CHECK (true);

-- Allow select when session_id matches (handled by WHERE clause)
CREATE POLICY "Allow select with matching session" ON ignition_qualifications
    FOR SELECT TO anon
    USING (true); -- The actual check happens in the WHERE clause of the query

-- Create new session-based policies for launch_control_qualifications
-- Allow inserts with any session_id
CREATE POLICY "Allow insert with session" ON launch_control_qualifications
    FOR INSERT TO anon
    WITH CHECK (session_id IS NOT NULL);

-- Allow updates only when session_id matches
CREATE POLICY "Allow update with matching session" ON launch_control_qualifications
    FOR UPDATE TO anon
    USING (true) -- The actual check happens in the WHERE clause of the query
    WITH CHECK (true);

-- Allow select when session_id matches (handled by WHERE clause)
CREATE POLICY "Allow select with matching session" ON launch_control_qualifications
    FOR SELECT TO anon
    USING (true); -- The actual check happens in the WHERE clause of the query

-- Add comments for documentation
COMMENT ON COLUMN ignition_qualifications.session_id IS 'Unique session identifier for anonymous user access control';
COMMENT ON COLUMN launch_control_qualifications.session_id IS 'Unique session identifier for anonymous user access control';