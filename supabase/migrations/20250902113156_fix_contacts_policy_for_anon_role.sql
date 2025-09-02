-- Fix contacts policy to work with anon role for frontend submissions
DROP POLICY IF EXISTS "Allow public contact form submissions" ON contacts;

-- Create policy that allows anon role (used by frontend) to insert
CREATE POLICY "Allow anon contact form submissions" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);