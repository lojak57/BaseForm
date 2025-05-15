-- Create a function for admin users to fix tenant RLS
CREATE OR REPLACE FUNCTION public.apply_tenant_rls_fix()
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Apply the policies from 02-fix-tenant-rls.sql
  -- First drop existing policies
  DROP POLICY IF EXISTS service_role_bypass_products ON public.products;
  DROP POLICY IF EXISTS service_role_bypass_fabrics ON public.fabrics;
  
  -- Create new tenant-specific policies for products
  CREATE POLICY IF NOT EXISTS tenant_products_policy ON public.products 
    FOR ALL
    TO authenticated
    USING (tenant_id = get_tenant_from_jwt());
  
  CREATE POLICY IF NOT EXISTS anon_products_policy ON public.products 
    FOR SELECT
    TO anon
    USING (tenant_id = 'vcsews');
  
  CREATE POLICY IF NOT EXISTS service_role_products_policy ON public.products 
    FOR ALL
    TO service_role
    USING (true);
  
  -- Create new tenant-specific policies for fabrics
  CREATE POLICY IF NOT EXISTS tenant_fabrics_policy ON public.fabrics 
    FOR ALL
    TO authenticated
    USING (tenant_id = get_tenant_from_jwt());
  
  CREATE POLICY IF NOT EXISTS anon_fabrics_policy ON public.fabrics 
    FOR SELECT
    TO anon
    USING (tenant_id = 'vcsews');
  
  CREATE POLICY IF NOT EXISTS service_role_fabrics_policy ON public.fabrics 
    FOR ALL
    TO service_role
    USING (true);
  
  -- Return success
  RETURN true;
END;
$$; 