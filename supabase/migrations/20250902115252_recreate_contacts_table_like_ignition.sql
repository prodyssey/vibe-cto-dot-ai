-- Recreate contacts table using the exact same pattern as ignition_qualifications
-- Drop existing table and policies
DROP POLICY IF EXISTS "anon_can_submit_contacts" ON contacts;
DROP TABLE IF EXISTS contacts;

-- Create contacts table with the same structure pattern as ignition_qualifications
CREATE TABLE contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  inquiry_type text not null,
  preferred_contact text not null check (preferred_contact in ('email', 'phone', 'text', 'either')),
  message text not null,
  session_id text,
  source text default 'contact_form',
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy exactly like ignition_qualifications
CREATE POLICY "anon_can_submit_contacts" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create indexes
CREATE INDEX contacts_email_idx ON contacts(email);
CREATE INDEX contacts_created_at_idx ON contacts(created_at desc);