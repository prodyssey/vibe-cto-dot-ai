-- Drop existing table if it exists
drop table if exists public.ignition_qualifications CASCADE;

-- Create ignition_qualifications table
create table public.ignition_qualifications (
  id uuid default gen_random_uuid() primary key,
  budget text not null,
  needs_rate_reduction boolean default false,
  rate_reduction_reason text,
  name text not null,
  email text not null,
  preferred_contact text not null check (preferred_contact in ('email', 'phone', 'text', 'either')),
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ignition_qualifications enable row level security;

-- Create policies
-- Allow anyone to insert (for lead collection)
create policy "Anyone can create qualification"
  on public.ignition_qualifications for insert
  with check (true);

-- Only authenticated users can view qualifications
create policy "Authenticated users can view qualifications"
  on public.ignition_qualifications for select
  using (auth.role() = 'authenticated');

-- Create indexes
create index ignition_qualifications_email_idx on public.ignition_qualifications(email);
create index ignition_qualifications_created_at_idx on public.ignition_qualifications(created_at desc);