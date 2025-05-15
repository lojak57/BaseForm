-- Apply source column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS source TEXT;

-- Add index on source column for faster queries
CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);

-- Set all products to default source of 'vcsews'
UPDATE products SET source = 'vcsews' WHERE source IS NULL; 