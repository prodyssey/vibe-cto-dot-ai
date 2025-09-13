-- Create ConvertKit tag cache table for persistent tag ID storage
CREATE TABLE IF NOT EXISTS public.convertkit_tag_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag_name TEXT NOT NULL UNIQUE,
    tag_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '5 minutes')
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_convertkit_tag_cache_tag_name ON public.convertkit_tag_cache(tag_name);
CREATE INDEX IF NOT EXISTS idx_convertkit_tag_cache_expires_at ON public.convertkit_tag_cache(expires_at);

-- Enable Row Level Security
ALTER TABLE public.convertkit_tag_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow access from API routes
-- Since this is used by API routes, we need to allow access for the service role
CREATE POLICY "Allow API access to tag cache"
    ON public.convertkit_tag_cache FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create a function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_tag_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM public.convertkit_tag_cache 
    WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update the updated_at and expires_at columns
CREATE OR REPLACE FUNCTION update_tag_cache_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    NEW.expires_at = now() + INTERVAL '5 minutes';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update timestamps on updates
CREATE TRIGGER update_convertkit_tag_cache_timestamps
    BEFORE UPDATE ON public.convertkit_tag_cache
    FOR EACH ROW EXECUTE FUNCTION update_tag_cache_timestamps();

-- Grant necessary permissions for API access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.convertkit_tag_cache TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.convertkit_tag_cache TO authenticated;

-- Create a function to upsert tag cache entries
CREATE OR REPLACE FUNCTION upsert_tag_cache(
    p_tag_name TEXT,
    p_tag_id INTEGER
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.convertkit_tag_cache (tag_name, tag_id)
    VALUES (p_tag_name, p_tag_id)
    ON CONFLICT (tag_name) 
    DO UPDATE SET 
        tag_id = EXCLUDED.tag_id,
        updated_at = now(),
        expires_at = now() + INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION cleanup_expired_tag_cache() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION upsert_tag_cache(TEXT, INTEGER) TO anon, authenticated;