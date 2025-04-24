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
CREATE INDEX IF NOT EXISTS idx_wellness_moods_user_created ON wellness_moods(user_id, created_at);

-- Insert some sample data for testing
INSERT INTO wellness_moods (user_id, mood, mood_value, notes, created_at)
VALUES 
  ('preview-user', 'Great', 5, 'Feeling fantastic today!', NOW() - INTERVAL '6 days'),
  ('preview-user', 'Good', 4, 'Had a productive day', NOW() - INTERVAL '5 days'),
  ('preview-user', 'Okay', 3, 'Just an average day', NOW() - INTERVAL '4 days'),
  ('preview-user', 'Low', 2, 'Feeling a bit down today', NOW() - INTERVAL '3 days'),
  ('preview-user', 'Good', 4, 'Things are looking up', NOW() - INTERVAL '2 days'),
  ('preview-user', 'Great', 5, 'Had a wonderful day!', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
