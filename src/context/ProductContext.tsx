import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Fabric } from "@/context/CartContext";
import { getCategoryById } from "@/data/categories";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./AuthContext";

// Define a constant for this site's source identifier
const SITE_SOURCE = "vcsews";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  getProductsByCategory: (categoryId: string) => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getAllProducts: () => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const { currentTenant } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, [currentTenant]); // Re-fetch when tenant changes

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the current tenant or fallback to the default
      const tenantToUse = currentTenant || SITE_SOURCE;
      console.log("Fetching products for tenant:", tenantToUse);
      
      // Fetch products from Supabase with nested fabrics data in a single query
      // AND explicitly filter by tenant_id to ensure RLS is working correctly
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          fabrics (*)
        `)
        .eq('tenant_id', tenantToUse) // Explicitly filter by tenant_id
        .order('created_at', { ascending: false });
      
      if (productsError) {
        console.error("Error fetching products:", productsError);
        throw productsError;
      }
      
      console.log("Products fetched from database:", productsData?.length || 0, productsData);
      
      // Map the data to our Product type format
      const mappedProducts = productsData.map(product => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        description: product.description || '',
        categoryId: product.category_id,
        hasFabricSelection: product.has_fabric_selection,
        defaultImages: product.default_images || [],
        fabrics: (product.fabrics || []).map(fabric => ({
          code: fabric.code,
          label: fabric.label,
          upcharge: fabric.upcharge,
          swatch: fabric.swatch || '',
          imgOverride: fabric.img_override || []
        })),
        tenant_id: product.tenant_id || tenantToUse
      }));
      
      console.log("Mapped products to display:", mappedProducts?.length || 0);
      setProducts(mappedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get products by category
  const getProductsByCategory = (categoryId: string): Product[] => {
    return products.filter(product => product.categoryId === categoryId);
  };

  // Helper function to get product by slug
  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(product => product.slug === slug);
  };

  // Helper function to get all products
  const getAllProducts = (): Product[] => {
    return products;
  };

  return (
    <ProductContext.Provider
      value={{ 
        products, 
        loading, 
        error, 
        getProductsByCategory, 
        getProductBySlug, 
        getAllProducts,
        refreshProducts: fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}; 