-- Add 'text' as a valid contact method option
ALTER TABLE ignition_waitlist 
DROP CONSTRAINT IF EXISTS ignition_waitlist_contact_method_check;

ALTER TABLE ignition_waitlist 
ADD CONSTRAINT ignition_waitlist_contact_method_check 
CHECK (contact_method IN ('email', 'phone', 'text', 'either'));