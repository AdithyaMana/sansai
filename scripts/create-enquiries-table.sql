-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) NOT NULL,
  cart_items JSONB NOT NULL,
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);

-- Create index on phone number for quick lookups
CREATE INDEX IF NOT EXISTS idx_enquiries_phone ON enquiries(phone_number);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- Enable RLS
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- RLS policy: Allow all to read/write their own enquiries
CREATE POLICY "Allow all to create enquiries" ON enquiries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to view enquiries" ON enquiries
  FOR SELECT
  USING (true);
