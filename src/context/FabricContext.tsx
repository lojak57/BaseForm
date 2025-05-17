import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

// Define the structure of a Fabric
export interface FabricItem {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  customColor?: string;
  price: number;
  swatch: string;  // URL to fabric swatch image
  inStock: boolean;
  sortOrder: number;
  images: string[];  // URLs to additional fabric images
  createdAt: string;
  updatedAt: string;
}

// Define the FabricContext shape
interface FabricContextType {
  fabrics: FabricItem[];
  loading: boolean;
  error: string | null;
  getFabricById: (id: string) => FabricItem | undefined;
  getFabricByCode: (code: string) => FabricItem | undefined;
  addFabric: (fabric: Omit<FabricItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FabricItem>;
  updateFabric: (fabric: FabricItem) => Promise<FabricItem>;
  deleteFabric: (id: string) => Promise<void>;
  refreshFabrics: () => Promise<void>;
}

// Create the context
const FabricContext = createContext<FabricContextType | undefined>(undefined);

// Define standard color options
export const COLOR_OPTIONS = [
  "black",
  "white",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "brown",
  "pink",
  "gray",
  "navy",
  "teal",
  "beige",
  "maroon",
  "olive",
  "coral",
  "turquoise",
  "lavender",
  "mint",
  "multi"
];

// Provider component
export function FabricProvider({ children }: { children: ReactNode }) {
  const { currentTenant } = useAuth();
  const [fabrics, setFabrics] = useState<FabricItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load fabrics on component mount and when tenant changes
  useEffect(() => {
    refreshFabrics();
  }, [currentTenant]);

  // Function to refresh fabrics from the database
  const refreshFabrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch fabrics from Supabase
      const { data, error } = await supabase
        .from('fabric_library')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        throw error;
      }

      // Map database fields to our FabricItem interface
      const mappedFabrics: FabricItem[] = data.map((fabric) => ({
        id: fabric.id,
        code: fabric.code,
        name: fabric.name,
        description: fabric.description || '',
        color: fabric.color,
        customColor: fabric.custom_color,
        price: fabric.price || 0,
        swatch: fabric.swatch,
        inStock: fabric.in_stock,
        sortOrder: fabric.sort_order || 0,
        images: fabric.images || [],
        createdAt: fabric.created_at,
        updatedAt: fabric.updated_at
      }));

      setFabrics(mappedFabrics);
    } catch (err) {
      console.error('Error fetching fabrics:', err);
      setError('Failed to load fabrics');
      toast.error('Failed to load fabric library');
    } finally {
      setLoading(false);
    }
  };

  // Get fabric by ID
  const getFabricById = (id: string) => {
    return fabrics.find((fabric) => fabric.id === id);
  };

  // Get fabric by code
  const getFabricByCode = (code: string) => {
    return fabrics.find((fabric) => fabric.code === code);
  };

  // Add a new fabric
  const addFabric = async (fabricData: Omit<FabricItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Check if fabric with same code already exists
      if (getFabricByCode(fabricData.code)) {
        throw new Error(`Fabric with code ${fabricData.code} already exists`);
      }

      // Insert fabric into Supabase
      const { data, error } = await supabase
        .from('fabric_library')
        .insert({
          code: fabricData.code,
          name: fabricData.name,
          description: fabricData.description,
          color: fabricData.color,
          custom_color: fabricData.customColor,
          price: fabricData.price,
          swatch: fabricData.swatch,
          in_stock: fabricData.inStock,
          sort_order: fabricData.sortOrder,
          images: fabricData.images
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Map the inserted data to our FabricItem interface
      const newFabric: FabricItem = {
        id: data.id,
        code: data.code,
        name: data.name,
        description: data.description || '',
        color: data.color,
        customColor: data.custom_color,
        price: data.price || 0,
        swatch: data.swatch,
        inStock: data.in_stock,
        sortOrder: data.sort_order || 0,
        images: data.images || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      // Update local state
      setFabrics([...fabrics, newFabric]);
      toast.success('Fabric added successfully');

      return newFabric;
    } catch (err) {
      console.error('Error adding fabric:', err);
      toast.error(`Failed to add fabric: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  // Update an existing fabric
  const updateFabric = async (fabricData: FabricItem) => {
    try {
      // Update fabric in Supabase
      const { data, error } = await supabase
        .from('fabric_library')
        .update({
          code: fabricData.code,
          name: fabricData.name,
          description: fabricData.description,
          color: fabricData.color,
          custom_color: fabricData.customColor,
          price: fabricData.price,
          swatch: fabricData.swatch,
          in_stock: fabricData.inStock,
          sort_order: fabricData.sortOrder,
          images: fabricData.images,
          updated_at: new Date().toISOString()
        })
        .eq('id', fabricData.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Map the updated data to our FabricItem interface
      const updatedFabric: FabricItem = {
        id: data.id,
        code: data.code,
        name: data.name,
        description: data.description || '',
        color: data.color,
        customColor: data.custom_color,
        price: data.price || 0,
        swatch: data.swatch,
        inStock: data.in_stock,
        sortOrder: data.sort_order || 0,
        images: data.images || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      // Update local state
      setFabrics(fabrics.map((fabric) => 
        fabric.id === updatedFabric.id ? updatedFabric : fabric
      ));
      
      toast.success('Fabric updated successfully');
      return updatedFabric;
    } catch (err) {
      console.error('Error updating fabric:', err);
      toast.error(`Failed to update fabric: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  // Delete a fabric
  const deleteFabric = async (id: string) => {
    try {
      // Delete fabric from Supabase
      const { error } = await supabase
        .from('fabric_library')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setFabrics(fabrics.filter((fabric) => fabric.id !== id));
      toast.success('Fabric deleted successfully');
    } catch (err) {
      console.error('Error deleting fabric:', err);
      toast.error(`Failed to delete fabric: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  // Context value
  const value = {
    fabrics,
    loading,
    error,
    getFabricById,
    getFabricByCode,
    addFabric,
    updateFabric,
    deleteFabric,
    refreshFabrics
  };

  return (
    <FabricContext.Provider value={value}>
      {children}
    </FabricContext.Provider>
  );
}

// Custom hook to use the FabricContext
export function useFabrics() {
  const context = useContext(FabricContext);
  if (context === undefined) {
    throw new Error('useFabrics must be used within a FabricProvider');
  }
  return context;
} 