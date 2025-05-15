-- Add source column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS source TEXT;

-- Update existing vcsews products
-- (Assuming we can identify vcsews products by some criteria, in this case we'll
-- set all products with NULL source to "vcsews" as a starting point)
UPDATE products
SET source = 'vcsews'
WHERE source IS NULL;

-- Create an index on the source column for faster queries
CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);

-- Add comment to explain the purpose of this column
COMMENT ON COLUMN products.source IS 'Identifies which site the product belongs to (e.g., vcsews, trueform)'; 