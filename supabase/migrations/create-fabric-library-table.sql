-- Create fabric_library table
CREATE TABLE IF NOT EXISTS fabric_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  custom_color TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  swatch TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE fabric_library ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage fabrics (all operations)
-- In a real production environment, you would want to restrict this further
CREATE POLICY "Authenticated users can manage fabrics" ON fabric_library
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy for public to view all in-stock fabrics
CREATE POLICY "Public can view in-stock fabrics" ON fabric_library
  FOR SELECT
  TO anon
  USING (in_stock = true);

-- Create update trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_fabric_library_updated_at ON fabric_library;
CREATE TRIGGER update_fabric_library_updated_at
BEFORE UPDATE ON fabric_library
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add sample fabrics (uncomment and run if you want sample data)
/*
INSERT INTO fabric_library (code, name, description, color, price, swatch, sort_order) VALUES
('cotton-white', 'White Cotton', 'High-quality cotton fabric with a smooth finish', 'white', 0, 'https://images.unsplash.com/photo-1528459801416-a9241982e8f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', 0),
('linen-beige', 'Natural Linen', 'Breathable linen fabric, perfect for hot weather', 'beige', 5.99, 'https://images.unsplash.com/photo-1581513184241-0a764d92289e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', 1),
('denim-blue', 'Indigo Denim', 'Classic medium-weight denim with rich indigo color', 'blue', 7.99, 'https://images.unsplash.com/photo-1543806053-66dd72ee4567?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', 2);
*/
