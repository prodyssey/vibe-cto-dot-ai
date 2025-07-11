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