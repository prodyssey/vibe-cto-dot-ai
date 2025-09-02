-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can create their own contact submissions" ON contacts;
DROP POLICY IF EXISTS "Users can view their own contact submissions" ON contacts;

-- Create permissive policies for contact form submissions
CREATE POLICY "Allow public contact form submissions" ON contacts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to view contact submissions" ON contacts
  FOR SELECT
  USING (true);