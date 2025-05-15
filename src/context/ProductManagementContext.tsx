import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Product, Fabric } from "@/context/CartContext";
import { categories } from "@/data/categories";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

// Define a constant for this site's source identifier
const SITE_SOURCE = "vcsews";

interface ProductManagementContextType {
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getAllProducts: () => Promise<Product[]>;
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductManagementContext = createContext<ProductManagementContextType | undefined>(undefined);

export function ProductManagementProvider({ children }: { children: ReactNode }) {
  const { currentTenant } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Memoize the fetch function to prevent unnecessary re-creation
  const fetchProducts = useCallback(async (forceFetch = false) => {
    // Prevent excessive fetching by checking if we fetched recently (within 5 seconds)
    const now = Date.now();
    if (!forceFetch && now - lastFetchTime < 5000 && products.length > 0) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products from Supabase with nested fabrics data in a single query
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          fabrics (*)
        `)
        .eq('source', SITE_SOURCE) // Add filter for vcsews products only
        .order('created_at', { ascending: false });
      
      if (productsError) {
        throw productsError;
      }
      
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
        source: product.source || SITE_SOURCE
      }));
      
      setProducts(mappedProducts);
      setLastFetchTime(now);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime, products.length]);

  // Fetch products on initial load and when tenant changes
  useEffect(() => {
    fetchProducts(true);
  }, [currentTenant]);

  const addProduct = async (product: Product) => {
    try {
      // Check if product slug already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single();
        
      if (existingProduct) {
        toast.error("A product with this slug already exists");
        return;
      }
      
      // Check if the category is valid
      const categoryExists = categories.some((c) => c.id === product.categoryId);
      if (!categoryExists) {
        toast.error("Invalid category selected");
        return;
      }
      
      // Make sure we have a valid UUID
      if (!product.id || !isValidUUID(product.id)) {
        product.id = crypto.randomUUID();
      }
      
      // For products without fabric selection, we can skip creating fabrics
      // but still set hasFabricSelection to false explicitly
      const hasFabricSelection = product.hasFabricSelection === true;
      
      // If we have fabric selection but no fabrics, create a default one
      if (hasFabricSelection && (!product.fabrics || product.fabrics.length === 0)) {
        console.warn("Fabric selection enabled but no fabrics provided, creating default fabric");
        product.fabrics = [{
          code: "default",
          label: "Default",
          swatch: "",
          upcharge: 0,
          imgOverride: []
        }];
      }
      
      // Insert the product into Supabase
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.categoryId,
          has_fabric_selection: hasFabricSelection,
          default_images: product.defaultImages,
          source: SITE_SOURCE // Add source to identify which application the product belongs to
          // tenant_id will be set automatically by RLS trigger
        })
        .select()
        .single();
        
      if (productError) {
        console.error('Error adding product:', productError);
        throw productError;
      }
      
      // Only insert fabrics if we have fabric selection enabled
      if (hasFabricSelection && product.fabrics && product.fabrics.length > 0) {
        const fabricsToInsert = product.fabrics.map(fabric => ({
          product_id: newProduct.id,
          code: fabric.code,
          label: fabric.label,
          swatch: fabric.swatch,
          upcharge: fabric.upcharge,
          img_override: fabric.imgOverride || []
        }));
        
        const { error: fabricsError } = await supabase
          .from('fabrics')
          .insert(fabricsToInsert);
          
        if (fabricsError) {
          throw fabricsError;
        }
      }
      
      // Refresh the products list
      fetchProducts(true);
      toast.success("Product added successfully");
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error(`Failed to add product: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      // Ensure the hasFabricSelection field is a boolean
      const hasFabricSelection = product.hasFabricSelection === true;
      
      // If fabric selection is enabled but no fabrics, create a default one
      if (hasFabricSelection && (!product.fabrics || product.fabrics.length === 0)) {
        console.warn("Fabric selection enabled but no fabrics provided, creating default fabric");
        product.fabrics = [{
          code: "default",
          label: "Default",
          swatch: "",
          upcharge: 0,
          imgOverride: []
        }];
      }
      
      // Update the product in Supabase
      const { error: productError } = await supabase
        .from('products')
        .update({
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.categoryId,
          has_fabric_selection: hasFabricSelection,
          default_images: product.defaultImages,
          source: SITE_SOURCE, // Ensure source is set to vcsews
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);
        
      if (productError) {
        throw productError;
      }
      
      // Delete existing fabrics for this product
      const { error: deleteFabricsError } = await supabase
        .from('fabrics')
        .delete()
        .eq('product_id', product.id);
        
      if (deleteFabricsError) {
        throw deleteFabricsError;
      }
      
      // Only insert fabrics if we have fabric selection enabled and fabrics exist
      if (hasFabricSelection && product.fabrics && product.fabrics.length > 0) {
        const fabricsToInsert = product.fabrics.map(fabric => ({
          product_id: product.id,
          code: fabric.code,
          label: fabric.label,
          swatch: fabric.swatch,
          upcharge: fabric.upcharge,
          img_override: fabric.imgOverride || []
        }));
        
        const { error: fabricsError } = await supabase
          .from('fabrics')
          .insert(fabricsToInsert);
          
        if (fabricsError) {
          throw fabricsError;
        }
      }
      
      // Refresh the products list
      fetchProducts(true);
      toast.success("Product updated successfully");
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error(`Failed to update product: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      // Delete product (fabrics will be cascade deleted due to foreign key constraint)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) {
        throw error;
      }
      
      // Refresh the products list
      fetchProducts();
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error("Failed to delete product");
    }
  };

  const getAllProducts = async () => {
    // Return the current products if we have them and not in loading state
    if (products.length > 0 && !loading) {
      return products;
    }
    
    // Otherwise fetch products
    await fetchProducts(true);
    return products;
  };

  return (
    <ProductManagementContext.Provider
      value={{ 
        products, 
        loading, 
        error, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        getAllProducts 
      }}
    >
      {children}
    </ProductManagementContext.Provider>
  );
}

export const useProductManagement = () => {
  const context = useContext(ProductManagementContext);
  if (context === undefined) {
    throw new Error(
      "useProductManagement must be used within a ProductManagementProvider"
    );
  }
  return context;
};

// Helper function to validate UUID
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}; 
