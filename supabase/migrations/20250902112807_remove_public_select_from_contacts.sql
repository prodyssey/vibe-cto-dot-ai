-- Remove public SELECT access from contacts table
-- Contact submissions should not be publicly viewable
DROP POLICY IF EXISTS "Allow public to view contact submissions" ON contacts;