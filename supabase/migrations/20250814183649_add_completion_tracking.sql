-- Add completion tracking to qualification tables

-- Add completed column to ignition_qualifications
ALTER TABLE ignition_qualifications 
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;

-- Add completed column to launch_control_qualifications
ALTER TABLE launch_control_qualifications 
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;

-- Set existing records to completed = true since they were created with the old flow
UPDATE ignition_qualifications 
SET completed = TRUE 
WHERE completed IS NULL OR completed = FALSE;

UPDATE launch_control_qualifications 
SET completed = TRUE 
WHERE completed IS NULL OR completed = FALSE;

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_ignition_qualifications_completed 
ON ignition_qualifications(completed);

CREATE INDEX IF NOT EXISTS idx_launch_control_qualifications_completed 
ON launch_control_qualifications(completed);

-- Add comments for documentation
COMMENT ON COLUMN ignition_qualifications.completed IS 'Tracks whether the user completed the full qualification process';
COMMENT ON COLUMN launch_control_qualifications.completed IS 'Tracks whether the user completed the full qualification process';