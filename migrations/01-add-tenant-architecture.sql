-- Add tenant_id to all existing tables
ALTER TABLE public.products 
ADD COLUMN tenant_id TEXT NOT NULL DEFAULT 'vcsews';

ALTER TABLE public.fabrics 
ADD COLUMN tenant_id TEXT NOT NULL DEFAULT 'vcsews';

-- Create JWT claim helper function
CREATE OR REPLACE FUNCTION get_tenant_from_jwt() 
RETURNS TEXT AS $$
DECLARE
  tenant_claim TEXT;
  raw_claims TEXT;
BEGIN
  -- Try to get JWT claims
  raw_claims := current_setting('request.jwt.claims', true);
  
  -- If no JWT claims or they're null, return default tenant
  IF raw_claims IS NULL OR raw_claims = '' THEN
    RETURN 'vcsews';
  END IF;

  -- Extract app_name from app_metadata in JWT claims
  BEGIN
    tenant_claim := (raw_claims::json->'app_metadata'->>'app_name')::TEXT;
  EXCEPTION WHEN OTHERS THEN
    -- If parsing fails, return default tenant
    RETURN 'vcsews';
  END;
  
  -- Return tenant name or default if NULL
  RETURN COALESCE(tenant_claim, 'vcsews');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policy that allows users with 'service_role' to bypass RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_role_bypass_products ON public.products 
  USING (auth.role() = 'service_role'::text OR auth.role() = 'authenticated'::text);

ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_role_bypass_fabrics ON public.fabrics
  USING (auth.role() = 'service_role'::text OR auth.role() = 'authenticated'::text);

-- Add trigger to automatically set tenant_id on new rows 
CREATE OR REPLACE FUNCTION set_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tenant_id = get_tenant_from_jwt();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_products_tenant_id
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION set_tenant_id();

CREATE TRIGGER set_fabrics_tenant_id
BEFORE INSERT ON public.fabrics
FOR EACH ROW
EXECUTE FUNCTION set_tenant_id();

-- Add indexes for better performance with tenant filtering
CREATE INDEX idx_products_tenant_id ON public.products(tenant_id);
CREATE INDEX idx_fabrics_tenant_id ON public.fabrics(tenant_id);

-- Update existing product source to be tenant_id where applicable
UPDATE public.products SET tenant_id = source WHERE source IS NOT NULL; 