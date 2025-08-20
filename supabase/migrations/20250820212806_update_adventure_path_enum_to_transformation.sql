-- Update the adventure_path enum to use 'transformation' instead of 'interstellar'

-- Add the new 'transformation' value to the enum
ALTER TYPE adventure_path ADD VALUE IF NOT EXISTS 'transformation';

-- Commit the transaction to make the new enum value available
COMMIT;
BEGIN;

-- Update any existing records that might have 'interstellar' to use 'transformation'
UPDATE adventure_sessions 
SET final_path = 'transformation' 
WHERE final_path = 'interstellar';

-- Note: We cannot directly remove the 'interstellar' value from the enum without recreating it
-- This would require more complex steps involving dropping and recreating the enum
-- For now, we'll leave 'interstellar' in the enum but use 'transformation' going forward