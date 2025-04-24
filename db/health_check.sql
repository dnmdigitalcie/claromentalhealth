-- Create a simple health check table for testing API connections
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'ok',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert a test record
INSERT INTO health_check (status) VALUES ('ok');
