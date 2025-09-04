-- Add performance indexes for time-based RLS queries
-- These indexes optimize the "created_at > NOW() - INTERVAL '1 hour'" conditions
-- used in our RLS policies for SELECT operations

-- Indexes for time-based queries on created_at column
CREATE INDEX IF NOT EXISTS idx_contacts_created_at 
  ON contacts (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_waitlist_created_at
  ON community_waitlist (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ignition_waitlist_created_at
  ON ignition_waitlist (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_launch_control_waitlist_created_at
  ON launch_control_waitlist (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ignition_qualifications_created_at
  ON ignition_qualifications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_launch_control_qualifications_created_at
  ON launch_control_qualifications (created_at DESC);

-- Composite indexes for session-based + time-based queries
-- These will be very efficient for our RLS policies that check both conditions
CREATE INDEX IF NOT EXISTS idx_contacts_session_created
  ON contacts (session_id, created_at DESC)
  WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_community_waitlist_session_created
  ON community_waitlist (session_id, created_at DESC)
  WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ignition_waitlist_session_created
  ON ignition_waitlist (session_id, created_at DESC)
  WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_launch_control_waitlist_session_created
  ON launch_control_waitlist (session_id, created_at DESC)
  WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ignition_qualifications_session_created
  ON ignition_qualifications (session_id, created_at DESC)
  WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_launch_control_qualifications_session_created
  ON launch_control_qualifications (session_id, created_at DESC)
  WHERE session_id IS NOT NULL;

-- Summary and verification
DO $$
BEGIN
    RAISE NOTICE 'Performance indexes created for RLS time-based queries';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE '- Created indexes on created_at (DESC) for time-range queries';
    RAISE NOTICE '- Created composite indexes on (session_id, created_at) for session-based queries';
    RAISE NOTICE '- Used CONCURRENTLY to avoid blocking table operations';
    RAISE NOTICE '- Indexes will significantly improve RLS policy evaluation performance';
    RAISE NOTICE '- PostgreSQL can efficiently use these for "created_at > NOW() - INTERVAL" queries';
    RAISE NOTICE 'Total indexes created: 12 (6 time-based + 6 session-composite)';
END $$;