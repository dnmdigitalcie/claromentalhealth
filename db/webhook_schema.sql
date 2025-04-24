-- Create webhook_destinations table
CREATE TABLE IF NOT EXISTS webhook_destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(1024) NOT NULL,
  secret_key VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  event_types TEXT[] DEFAULT '{}',
  retry_count INT DEFAULT 3,
  timeout_ms INT DEFAULT 5000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  headers JSONB DEFAULT '{}'::jsonb,
  description TEXT
);

-- Create webhook_events table
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID REFERENCES webhook_destinations(id) ON DELETE CASCADE,
  event_type VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'pending', 'success', 'failed', 'retrying'
  status_code INT,
  response_body TEXT,
  attempts INT DEFAULT 0,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  error_message TEXT,
  request_duration_ms INT,
  idempotency_key VARCHAR(255)
);

-- Create webhook_logs table for detailed logging
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES webhook_events(id) ON DELETE CASCADE,
  attempt_number INT NOT NULL,
  request_headers JSONB,
  request_body TEXT,
  response_headers JSONB,
  response_body TEXT,
  status_code INT,
  error_message TEXT,
  duration_ms INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_webhook_events_destination_id ON webhook_events(destination_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_id ON webhook_logs(event_id);

-- Create webhook_event_types table for predefined event types
CREATE TABLE IF NOT EXISTS webhook_event_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  schema JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default event types
INSERT INTO webhook_event_types (name, description, is_active)
VALUES 
  ('user.created', 'Triggered when a new user is created', true),
  ('user.updated', 'Triggered when a user profile is updated', true),
  ('course.published', 'Triggered when a course is published', true),
  ('course.enrolled', 'Triggered when a user enrolls in a course', true),
  ('lesson.completed', 'Triggered when a user completes a lesson', true),
  ('certificate.issued', 'Triggered when a certificate is issued', true)
ON CONFLICT (name) DO NOTHING;
