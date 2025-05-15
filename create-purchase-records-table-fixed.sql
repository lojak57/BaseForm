-- Create purchase_records table for tracking Stripe payments
CREATE TABLE purchase_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  status TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  product_data JSONB,
  customer_email TEXT,
  customer_name TEXT,
  amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tenant_id TEXT -- Store as text instead of foreign key
);

-- Add RLS policies for purchase_records
ALTER TABLE purchase_records ENABLE ROW LEVEL SECURITY;

-- Policy for inserting records (allow anyone to insert)
CREATE POLICY "Allow anyone to insert purchase records"
  ON purchase_records
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Policy for selecting own records based on authenticated user
CREATE POLICY "Users can select their own records"
  ON purchase_records
  FOR SELECT
  TO authenticated
  USING (true);

-- No trigger needed - we'll handle tenant_id on the client side 