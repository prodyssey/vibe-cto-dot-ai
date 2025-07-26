-- Add new columns to adventure_sessions table
ALTER TABLE adventure_sessions 
ADD COLUMN IF NOT EXISTS current_scene_id TEXT DEFAULT 'entry',
ADD COLUMN IF NOT EXISTS visited_scenes JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS choices JSONB DEFAULT '[]';

-- Create new table for tracking scene visits
CREATE TABLE IF NOT EXISTS adventure_scene_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES adventure_sessions(id) ON DELETE CASCADE,
  scene_id TEXT NOT NULL,
  visit_count INTEGER DEFAULT 1,
  last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(session_id, scene_id)
);

-- Update adventure_choices table to work with new scene-based system
ALTER TABLE adventure_choices
ADD COLUMN IF NOT EXISTS scene_id TEXT,
ADD COLUMN IF NOT EXISTS choice_id TEXT,
ADD COLUMN IF NOT EXISTS made_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Drop old columns from adventure_choices (optional, only if you want to clean up)
-- ALTER TABLE adventure_choices
-- DROP COLUMN IF EXISTS question_number,
-- DROP COLUMN IF EXISTS question_text,
-- DROP COLUMN IF EXISTS choice_value,
-- DROP COLUMN IF EXISTS answered_at;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_adventure_scene_visits_session_id ON adventure_scene_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_adventure_choices_session_scene ON adventure_choices(session_id, scene_id);

-- Update the game_outcome enum to include new outcome
ALTER TYPE game_outcome ADD VALUE IF NOT EXISTS 'explore_service';

-- Create analytics table for tracking events
CREATE TABLE IF NOT EXISTS adventure_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES adventure_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for analytics queries
CREATE INDEX IF NOT EXISTS idx_adventure_analytics_session_id ON adventure_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_adventure_analytics_event_type ON adventure_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_adventure_analytics_timestamp ON adventure_analytics(timestamp);

-- Add preferences column to sessions
ALTER TABLE adventure_sessions
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"soundEnabled": true, "musicVolume": 0.5, "effectsVolume": 0.7}',
ADD COLUMN IF NOT EXISTS discovered_paths TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS unlocked_content TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS session_duration INTEGER;