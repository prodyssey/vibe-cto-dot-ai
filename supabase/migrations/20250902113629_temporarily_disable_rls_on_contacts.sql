-- Temporarily disable RLS on contacts table for testing
-- This should allow us to determine if the issue is RLS or something else
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;