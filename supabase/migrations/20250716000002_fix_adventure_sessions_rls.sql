-- Fix RLS policies for adventure_sessions to allow email updates

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for all users" ON adventure_sessions;
DROP POLICY IF EXISTS "Enable read for all users" ON adventure_sessions;
DROP POLICY IF EXISTS "Enable update for all users" ON adventure_sessions;

-- Enable RLS
ALTER TABLE adventure_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new sessions
CREATE POLICY "Enable insert for all users" ON adventure_sessions
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read all sessions (for analytics)
CREATE POLICY "Enable read for all users" ON adventure_sessions
  FOR SELECT
  USING (true);

-- Allow anyone to update their own session (identified by session_id)
CREATE POLICY "Enable update for all users" ON adventure_sessions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Note: In production, you might want to restrict updates to only the session owner
-- by storing a user_id or using session tokens