-- Fix contacts policy to exactly match community_waitlist (use public role)
DROP POLICY IF EXISTS "Allow contact form submissions" ON contacts;

-- Create policy identical to community_waitlist that works
CREATE POLICY "Users can insert their own contact submissions" ON contacts
  FOR INSERT
  WITH CHECK (true);