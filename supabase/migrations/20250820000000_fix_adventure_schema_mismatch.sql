-- Fix schema mismatch for adventure tables
-- Add missing path_scores column to adventure_sessions
ALTER TABLE adventure_sessions 
ADD COLUMN IF NOT EXISTS path_scores JSONB DEFAULT '{}';

-- Update adventure_choices table structure to match expected schema
-- The table has old columns (question_number, question_text, choice_value, answered_at) 
-- and new columns (scene_id, choice_id, made_at) - we need both to be non-null for the new system

-- Make the new columns required for new records but allow existing records
UPDATE adventure_choices 
SET scene_id = 'unknown', choice_id = 'unknown' 
WHERE scene_id IS NULL OR choice_id IS NULL;

-- Add completion_status column if it doesn't exist (referenced in utils.ts:244)
ALTER TABLE adventure_sessions
ADD COLUMN IF NOT EXISTS completion_status TEXT DEFAULT 'in_progress';

-- Create a view for backward compatibility with old choice system
CREATE OR REPLACE VIEW adventure_choices_unified AS 
SELECT 
  id,
  session_id,
  COALESCE(scene_id, 'scene_' || question_number::text) as scene_id,
  COALESCE(choice_id, choice_value) as choice_id,
  choice_text,
  COALESCE(made_at, answered_at) as made_at,
  -- Legacy columns for backward compatibility
  question_number,
  question_text,
  choice_value,
  answered_at
FROM adventure_choices;

-- Update RLS policies to use the unified view if needed
GRANT SELECT ON adventure_choices_unified TO anon, authenticated;