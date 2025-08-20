-- Fix RLS policy to allow session creation
-- Update the session-based policy to allow creation of new sessions

DROP POLICY IF EXISTS "session_based_sessions_access" ON "public"."adventure_sessions";

-- Create a more permissive policy for adventure_sessions that allows:
-- 1. Creating new sessions (INSERT with any ID)
-- 2. Accessing existing sessions if the session context matches
CREATE POLICY "session_creation_and_access" 
ON "public"."adventure_sessions" 
FOR ALL TO "anon", "authenticated"
USING (
  -- Allow reading if session context matches or no context is set
  id = get_current_session_id() OR 
  get_current_session_id() IS NULL
)
WITH CHECK (
  -- Allow creating/updating if session context matches or no context is set
  -- This is more permissive for INSERT operations (new session creation)
  id = get_current_session_id() OR 
  get_current_session_id() IS NULL
);