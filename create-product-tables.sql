-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  has_fabric_selection BOOLEAN DEFAULT FALSE,
  default_images JSONB DEFAULT '[]'::JSONB,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create fabrics table (1-many relationship with products)
CREATE TABLE IF NOT EXISTS fabrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  code TEXT,
  label TEXT,
  swatch TEXT,
  upcharge NUMERIC(10,2),
  img_override JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);
CREATE INDEX IF NOT EXISTS idx_fabrics_product ON fabrics(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public can read products, fabrics, and categories
CREATE POLICY "Public can read products" ON products
  FOR SELECT USING (true);
  
CREATE POLICY "Public can read fabrics" ON fabrics
  FOR SELECT USING (true);
  
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);
  
-- Only authenticated users can modify data
CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT TO authenticated WITH CHECK (true);
  
CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE TO authenticated USING (true);
  
CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE TO authenticated USING (true);
  
CREATE POLICY "Authenticated users can insert fabrics" ON fabrics
  FOR INSERT TO authenticated WITH CHECK (true);
  
CREATE POLICY "Authenticated users can update fabrics" ON fabrics
  FOR UPDATE TO authenticated USING (true);
  
CREATE POLICY "Authenticated users can delete fabrics" ON fabrics
  FOR DELETE TO authenticated USING (true);
  
CREATE POLICY "Authenticated users can insert categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (true);
  
CREATE POLICY "Authenticated users can update categories" ON categories
  FOR UPDATE TO authenticated USING (true);
  
CREATE POLICY "Authenticated users can delete categories" ON categories
  FOR DELETE TO authenticated USING (true); 