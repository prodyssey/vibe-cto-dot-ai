-- Create launch_control_waitlist table
CREATE TABLE IF NOT EXISTS public.launch_control_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.adventure_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_contact TEXT NOT NULL CHECK (preferred_contact IN ('email', 'phone', 'text', 'any')),
  company_name TEXT,
  current_scale TEXT,
  is_waitlist BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_launch_control_waitlist_session_id ON public.launch_control_waitlist(session_id);
CREATE INDEX idx_launch_control_waitlist_email ON public.launch_control_waitlist(email);
CREATE INDEX idx_launch_control_waitlist_created_at ON public.launch_control_waitlist(created_at);

-- Enable RLS
ALTER TABLE public.launch_control_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own waitlist entries" 
  ON public.launch_control_waitlist 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own waitlist entries" 
  ON public.launch_control_waitlist 
  FOR SELECT 
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_launch_control_waitlist_updated_at
  BEFORE UPDATE ON public.launch_control_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();