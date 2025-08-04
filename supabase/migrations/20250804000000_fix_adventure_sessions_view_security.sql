-- Fix adventure_sessions_public view to use SECURITY INVOKER
-- This ensures the view respects the RLS policies of the querying user
-- rather than bypassing them with the view owner's permissions

-- Drop the existing view
DROP VIEW IF EXISTS adventure_sessions_public;

-- Recreate the view with SECURITY INVOKER
-- This view provides public access to non-sensitive session fields
CREATE VIEW adventure_sessions_public 
WITH (security_invoker = true) AS
SELECT 
    id,
    player_name,
    is_generated_name,
    current_scene_id,
    created_at,
    updated_at
FROM adventure_sessions;

-- Grant access to the view for anonymous users
GRANT SELECT ON adventure_sessions_public TO anon;

-- Add documentation
COMMENT ON VIEW adventure_sessions_public IS 
'Public view of adventure sessions that excludes sensitive fields like email and preferences. Uses SECURITY INVOKER to respect RLS policies of the querying user.';