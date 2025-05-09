
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { Product, Fabric } from "@/context/CartContext";
import { categories } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products from Supabase
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (productsError) {
        throw productsError;
      }
      
      // For each product, fetch its fabrics
      const productsWithFabrics = await Promise.all(productsData.map(async (product) => {
        const { data: fabricsData, error: fabricsError } = await supabase
          .from('fabrics')
          .select('*')
          .eq('product_id', product.id);
        
        if (fabricsError) {
          throw fabricsError;
        }
        
        // Convert the Supabase fabric data to our Fabric type
        const fabrics: Fabric[] = fabricsData.map(fabric => ({
          code: fabric.code,
          label: fabric.label,
          upcharge: fabric.upcharge,
          swatch: fabric.swatch || '',
          imgOverride: fabric.img_override || []
        }));
        
        // Return the complete product with fabrics
        return {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          description: product.description || '',
          categoryId: product.category_id,
          hasFabricSelection: product.has_fabric_selection,
          defaultImages: product.default_images || [],
          fabrics: fabrics
        } as Product;
      }));
      
      setProducts(productsWithFabrics);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

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
      
      // Insert the product into Supabase
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          id: product.id, // Use the ID if provided, otherwise Supabase will generate one
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.categoryId,
          has_fabric_selection: product.hasFabricSelection,
          default_images: product.defaultImages
        })
        .select()
        .single();
        
      if (productError) {
        throw productError;
      }
      
      // If there are fabrics, insert them
      if (product.fabrics && product.fabrics.length > 0) {
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
      fetchProducts();
      toast.success("Product added successfully");
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error("Failed to add product");
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      // Update the product in Supabase
      const { error: productError } = await supabase
        .from('products')
        .update({
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.categoryId,
          has_fabric_selection: product.hasFabricSelection,
          default_images: product.defaultImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);
        
      if (productError) {
        throw productError;
      }
      
      // Delete existing fabrics and insert new ones
      if (product.fabrics) {
        // First delete existing fabrics for this product
        const { error: deleteFabricsError } = await supabase
          .from('fabrics')
          .delete()
          .eq('product_id', product.id);
          
        if (deleteFabricsError) {
          throw deleteFabricsError;
        }
        
        // Then insert new fabrics if there are any
        if (product.fabrics.length > 0) {
          const fabricsToInsert = product.fabrics.map(fabric => ({
            product_id: product.id,
            code: fabric.code,
            label: fabric.label,
            swatch: fabric.swatch,
            upcharge: fabric.upcharge,
            img_override: fabric.imgOverride || []
          }));
          
          const { error: insertFabricsError } = await supabase
            .from('fabrics')
            .insert(fabricsToInsert);
            
          if (insertFabricsError) {
            throw insertFabricsError;
          }
        }
      }
      
      // Refresh the products list
      fetchProducts();
      toast.success("Product updated successfully");
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error("Failed to update product");
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
    // Return the current products state or fetch if needed
    if (products.length === 0 && !loading && !error) {
      await fetchProducts();
    }
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
