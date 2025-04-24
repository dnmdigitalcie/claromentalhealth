-- Create a function to create the wellness_moods table if it doesn't exist
CREATE OR REPLACE FUNCTION create_wellness_moods_table()
RETURNS void AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'wellness_moods'
  ) THEN
    -- Create the table
    CREATE TABLE wellness_moods (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      mood VARCHAR(50) NOT NULL,
      mood_value INTEGER NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Add indexes for better performance
    CREATE INDEX idx_wellness_moods_user_id ON wellness_moods(user_id);
    CREATE INDEX idx_wellness_moods_created_at ON wellness_moods(created_at);
    CREATE INDEX idx_wellness_moods_user_created ON wellness_moods(user_id, created_at);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create the table
SELECT create_wellness_moods_table();
