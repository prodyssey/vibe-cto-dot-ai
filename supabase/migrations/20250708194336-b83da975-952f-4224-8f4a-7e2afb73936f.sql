-- Create enum for adventure paths
CREATE TYPE public.adventure_path AS ENUM ('ignition', 'launch_control', 'interstellar');

-- Create enum for game outcomes
CREATE TYPE public.game_outcome AS ENUM ('email_signup', 'book_meeting');

-- Create table for adventure game sessions
CREATE TABLE public.adventure_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  is_generated_name BOOLEAN NOT NULL DEFAULT FALSE,
  email TEXT,
  final_path adventure_path,
  final_outcome game_outcome,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create table for storing individual choices/answers
CREATE TABLE public.adventure_choices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.adventure_sessions(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  choice_text TEXT NOT NULL,
  choice_value TEXT NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.adventure_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adventure_choices ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public game)
CREATE POLICY "Anyone can create adventure sessions" 
ON public.adventure_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their own session" 
ON public.adventure_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can view adventure sessions" 
ON public.adventure_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create choices" 
ON public.adventure_choices 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view choices" 
ON public.adventure_choices 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_adventure_sessions_updated_at
  BEFORE UPDATE ON public.adventure_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_adventure_choices_session_id ON public.adventure_choices(session_id);
CREATE INDEX idx_adventure_sessions_created_at ON public.adventure_sessions(created_at);
CREATE INDEX idx_adventure_sessions_path ON public.adventure_sessions(final_path);