-- Create contacts table for contact form submissions
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    inquiry_type TEXT NOT NULL,
    preferred_contact TEXT NOT NULL DEFAULT 'email',
    message TEXT NOT NULL,
    session_id TEXT,
    source TEXT DEFAULT 'contact_form',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);

-- Create an index on inquiry_type for filtering
CREATE INDEX IF NOT EXISTS idx_contacts_inquiry_type ON public.contacts(inquiry_type);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for session-based access
-- Users can only access their own contact submissions via session_id
CREATE POLICY "Users can create their own contact submissions"
    ON public.contacts FOR INSERT
    WITH CHECK (
        session_id IS NOT NULL AND
        session_id != ''
    );

CREATE POLICY "Users can view their own contact submissions"
    ON public.contacts FOR SELECT
    USING (
        session_id IS NOT NULL AND
        session_id = current_setting('request.session_id', true)
    );

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.contacts TO anon;
GRANT SELECT, INSERT ON public.contacts TO authenticated;