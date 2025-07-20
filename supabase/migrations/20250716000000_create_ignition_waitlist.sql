-- Create ignition_waitlist table for managing forge inquiries
CREATE TABLE IF NOT EXISTS ignition_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES adventure_sessions(id) ON DELETE SET NULL,
  player_name TEXT,
  preferred_contact TEXT NOT NULL,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('email', 'phone', 'either')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ignition_waitlist_status ON ignition_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_ignition_waitlist_created_at ON ignition_waitlist(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ignition_waitlist_updated_at
  BEFORE UPDATE ON ignition_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE ignition_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own records
CREATE POLICY "Users can insert their own waitlist entries" ON ignition_waitlist
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view their own records
CREATE POLICY "Users can view their own waitlist entries" ON ignition_waitlist
  FOR SELECT
  USING (true);