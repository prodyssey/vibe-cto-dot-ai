-- Fix contacts policy to match community_waitlist pattern (no role specified = all roles)
DROP POLICY IF EXISTS "Allow anon contact form submissions" ON contacts;

-- Create policy without role specification (applies to all roles including anon)
CREATE POLICY "Users can insert contact form submissions" ON contacts
  FOR INSERT
  WITH CHECK (true);