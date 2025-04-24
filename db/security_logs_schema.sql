-- Create security_logs table for comprehensive security monitoring
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL,
  user_id VARCHAR(255),
  email VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_email ON security_logs(email);

-- Create view for suspicious activity monitoring
CREATE OR REPLACE VIEW suspicious_activity_view AS
SELECT 
  user_id,
  email,
  ip_address,
  COUNT(*) as failure_count,
  MIN(created_at) as first_attempt,
  MAX(created_at) as last_attempt
FROM 
  security_logs
WHERE 
  event_type = 'LOGIN_FAILURE'
  AND created_at > NOW() - INTERVAL '24 HOURS'
GROUP BY 
  user_id, email, ip_address
HAVING 
  COUNT(*) >= 5;

-- Create function to clean up old security logs (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_security_logs()
RETURNS void AS $$
BEGIN
  -- Delete logs older than 1 year (adjust retention period as needed)
  DELETE FROM security_logs
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run the cleanup function (if your database supports it)
-- For PostgreSQL, you might use pg_cron extension or set up an external scheduler
