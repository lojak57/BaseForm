-- Create orders table for storing order information
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  session_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  order_items JSONB NOT NULL,
  order_total DECIMAL(10, 2) NOT NULL,
  order_notes TEXT,
  order_status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage orders
CREATE POLICY "Authenticated users can manage orders" ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
