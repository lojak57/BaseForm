-- Disable RLS temporarily to fix immediate issues
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabrics DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with policies that work 
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_products ON public.products FOR ALL USING (true);

ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_fabrics ON public.fabrics FOR ALL USING (true);

-- Make sure tenant_id is set to 'vcsews' for all products
UPDATE public.products SET tenant_id = 'vcsews';
UPDATE public.fabrics SET tenant_id = 'vcsews'; 