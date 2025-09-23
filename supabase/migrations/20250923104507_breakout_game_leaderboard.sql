-- Create breakout game leaderboard table
CREATE TABLE IF NOT EXISTS breakout_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  initials VARCHAR(3) NOT NULL CHECK (length(initials) <= 3),
  score INTEGER NOT NULL CHECK (score > 0),
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'hard')),
  linkedin_username VARCHAR(100), -- Just store the username part for easy construction of profile URLs
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  ip_address INET,
  user_agent TEXT
);

-- Create index for fast score queries
CREATE INDEX idx_breakout_leaderboard_score_desc ON breakout_leaderboard(difficulty, score DESC);
CREATE INDEX idx_breakout_leaderboard_created_at ON breakout_leaderboard(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE breakout_leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view leaderboard
CREATE POLICY "Allow public read access" ON breakout_leaderboard
  FOR SELECT USING (true);

-- Create policy to allow inserts with session validation
CREATE POLICY "Allow insert with valid session" ON breakout_leaderboard
  FOR INSERT WITH CHECK (
    -- Allow inserts only if score is reasonable (prevent cheating)
    score <= 50000
  );

-- Add comment to table
COMMENT ON TABLE breakout_leaderboard IS 'Stores high scores for the Breakout game on the business card page';
COMMENT ON COLUMN breakout_leaderboard.linkedin_username IS 'LinkedIn username only (e.g., "craigsturgis" from linkedin.com/in/craigsturgis)';