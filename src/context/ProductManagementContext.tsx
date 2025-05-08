import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { Product, Fabric } from "@/context/CartContext";
import { products, categories } from "@/data/products";

interface ProductManagementContextType {
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getAllProducts: () => Product[];
}

const ProductManagementContext = createContext<ProductManagementContextType | undefined>(undefined);

export function ProductManagementProvider({ children }: { children: ReactNode }) {
  // For prototype purposes, we'll keep products in memory
  // In production, this would connect to a backend API
  const [productList, setProductList] = useState<Product[]>(products);

  const addProduct = (product: Product) => {
    // Check if product ID/slug already exists
    const existingProduct = productList.find(
      (p) => p.id === product.id || p.slug === product.slug
    );

    if (existingProduct) {
      toast.error("A product with this ID or slug already exists");
      return;
    }

    // Check if the category is valid
    const categoryExists = categories.some((c) => c.id === product.categoryId);
    if (!categoryExists) {
      toast.error("Invalid category selected");
      return;
    }

    // Add the product
    setProductList((prev) => [...prev, product]);
    
    // In a real app, we would save this to a database
    // For prototype, we'll simulate success
    toast.success("Product added successfully");
    
    // Update the imported products array for consistency
    // In real implementation, this would be a database call
    (products as Product[]).push(product);
  };

  const updateProduct = (product: Product) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === product.id ? product : p))
    );
    
    // Update the imported products array
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
    }
    
    toast.success("Product updated successfully");
  };

  const deleteProduct = (productId: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== productId));
    
    // Update the imported products array
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products.splice(index, 1);
    }
    
    toast.success("Product deleted successfully");
  };

  const getAllProducts = () => {
    return productList;
  };

  return (
    <ProductManagementContext.Provider
      value={{ addProduct, updateProduct, deleteProduct, getAllProducts }}
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