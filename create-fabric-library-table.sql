-- SQL script to create the fabric_library table

-- Create the fabric_library table
CREATE TABLE IF NOT EXISTS fabric_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  custom_color TEXT,
  price NUMERIC(10, 2) DEFAULT 0,
  swatch TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security policies for tenant isolation
ALTER TABLE fabric_library ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting fabrics (all users can view fabrics for their tenant)
CREATE POLICY "Tenants can view their own fabrics"
  ON fabric_library
  FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant', true)::text);

-- Create policy for inserting fabrics (authenticated users only)
CREATE POLICY "Authenticated users can add fabrics"
  ON fabric_library
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = current_setting('app.current_tenant', true)::text);

-- Create policy for updating fabrics (authenticated users only)
CREATE POLICY "Authenticated users can update their own fabrics"
  ON fabric_library
  FOR UPDATE
  TO authenticated
  USING (tenant_id = current_setting('app.current_tenant', true)::text);

-- Create policy for deleting fabrics (authenticated users only)
CREATE POLICY "Authenticated users can delete their own fabrics"
  ON fabric_library
  FOR DELETE
  TO authenticated
  USING (tenant_id = current_setting('app.current_tenant', true)::text);

-- Create index on code for faster lookups
CREATE INDEX fabric_library_code_idx ON fabric_library (code);

-- Create index on tenant_id for faster filtering
CREATE INDEX fabric_library_tenant_idx ON fabric_library (tenant_id);
