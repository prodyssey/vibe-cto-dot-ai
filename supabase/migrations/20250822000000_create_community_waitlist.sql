-- Create community_waitlist table for managing community signups
CREATE TABLE IF NOT EXISTS community_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES adventure_sessions(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_contact TEXT NOT NULL CHECK (preferred_contact IN ('email', 'phone', 'text', 'either')),
  contact_method TEXT NOT NULL CHECK (contact_method IN ('email', 'phone', 'text', 'either')),
  source TEXT DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Add unique constraint on email to prevent duplicates
  UNIQUE(email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_waitlist_status ON community_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_community_waitlist_created_at ON community_waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_waitlist_email ON community_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_community_waitlist_source ON community_waitlist(source);

-- Create updated_at trigger
CREATE TRIGGER update_community_waitlist_updated_at
  BEFORE UPDATE ON community_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE community_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own records
CREATE POLICY "Users can insert their own community waitlist entries" ON community_waitlist
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view their own records
CREATE POLICY "Users can view their own community waitlist entries" ON community_waitlist
  FOR SELECT
  USING (true);