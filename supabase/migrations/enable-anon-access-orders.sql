-- Add policy to allow anonymous (unauthenticated) users to insert orders
CREATE POLICY "Allow anonymous order creation" ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert orders (if not already covered)
CREATE POLICY "Allow authenticated order creation" ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
