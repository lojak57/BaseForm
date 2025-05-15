-- Add proper tenant filtering policies
-- Drop existing policies that don't filter by tenant
DROP POLICY IF EXISTS service_role_bypass_products ON public.products;
DROP POLICY IF EXISTS service_role_bypass_fabrics ON public.fabrics;

-- Create proper tenant filtering policies
-- For authenticated users: only see products from their tenant
CREATE POLICY tenant_products_policy ON public.products 
  FOR ALL
  TO authenticated
  USING (tenant_id = get_tenant_from_jwt());

-- For anonymous users: only see vcsews products (default tenant)
CREATE POLICY anon_products_policy ON public.products 
  FOR SELECT
  TO anon
  USING (tenant_id = 'vcsews');

-- For service_role: see all products (admin access)
CREATE POLICY service_role_products_policy ON public.products 
  FOR ALL
  TO service_role
  USING (true);

-- Apply similar policies to fabrics table
CREATE POLICY tenant_fabrics_policy ON public.fabrics 
  FOR ALL
  TO authenticated
  USING (tenant_id = get_tenant_from_jwt());

CREATE POLICY anon_fabrics_policy ON public.fabrics 
  FOR SELECT
  TO anon
  USING (tenant_id = 'vcsews');

CREATE POLICY service_role_fabrics_policy ON public.fabrics 
  FOR ALL
  TO service_role
  USING (true); 