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
  tenant_id UUID REFERENCES tenants(id)
);

-- Add RLS policies for purchase_records
ALTER TABLE purchase_records ENABLE ROW LEVEL SECURITY;

-- Policy for inserting records (allow from edge function)
CREATE POLICY "Allow anyone to insert purchase records"
  ON purchase_records
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Policy for selecting records (tenant-specific)
CREATE POLICY "Users can select their own tenant purchase records"
  ON purchase_records
  FOR SELECT
  TO authenticated
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Add trigger to automatically set tenant_id from JWT
CREATE OR REPLACE FUNCTION set_tenant_id_for_purchase()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tenant_id := (SELECT id FROM tenants WHERE id = auth.jwt() ->> 'tenant_id'::text)::uuid;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_purchase_tenant_id
BEFORE INSERT ON purchase_records
FOR EACH ROW
EXECUTE FUNCTION set_tenant_id_for_purchase(); 