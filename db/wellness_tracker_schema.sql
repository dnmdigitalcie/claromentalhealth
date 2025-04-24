-- Create wellness_moods table if it doesn't exist
CREATE TABLE IF NOT EXISTS wellness_moods (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  mood VARCHAR(50) NOT NULL,
  mood_value INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wellness_moods_user_id ON wellness_moods(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_moods_created_at ON wellness_moods(created_at);

-- Add a composite index for user_id and created_at for faster lookups
CREATE INDEX IF NOT EXISTS idx_wellness_moods_user_created ON wellness_moods(user_id, created_at);
