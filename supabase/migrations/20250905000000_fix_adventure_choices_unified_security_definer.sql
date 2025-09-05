-- Fix SECURITY DEFINER issue with adventure_choices_unified view
-- Recreate the view with explicit SECURITY INVOKER to resolve security linter warning

DROP VIEW IF EXISTS adventure_choices_unified;

-- Create the view with explicit SECURITY INVOKER (default behavior, but made explicit)
CREATE VIEW adventure_choices_unified 
WITH (security_invoker = true) AS 
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

-- Restore grants
GRANT SELECT ON adventure_choices_unified TO anon, authenticated;