-- Apply the same working policy pattern from ignition_qualifications to contacts
DROP POLICY IF EXISTS "Users can insert their own contact submissions" ON contacts;

-- Create policy exactly like the working ignition qualifications
CREATE POLICY "anon_can_submit_contacts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);