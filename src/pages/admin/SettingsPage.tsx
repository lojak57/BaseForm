import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductManagement } from "@/context/ProductManagementContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/data/categories";
import { PencilIcon, SaveIcon, Trash2Icon, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Default description template that will be editable
const DEFAULT_DESCRIPTION = "Handcrafted with care and attention to detail. This premium quality item is designed to be both functional and stylish. Made with high-quality materials that ensure durability and long-lasting performance.";

// Type for settings
interface SiteSettings {
  defaultProductDescription: string;
}

// Type for category management
interface CategoryWithProducts {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export default function SettingsPage() {
  const { getAllProducts } = useProductManagement();
  const navigate = useNavigate();
  
  // Settings state
  const [settings, setSettings] = useState<SiteSettings>({
    defaultProductDescription: DEFAULT_DESCRIPTION
  });
  
  // Category management state
  const [categoryState, setCategoryState] = useState<CategoryWithProducts[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToReplaceWith, setCategoryToReplaceWith] = useState<string>("");
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('vcsews-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Load product counts for categories
    const loadCategoriesWithProductCounts = async () => {
      const products = await getAllProducts();
      
      const categoriesWithCounts = categories.map(category => {
        const productCount = products.filter(p => p.categoryId === category.id).length;
        return {
          ...category,
          productCount
        };
      });
      
      setCategoryState(categoriesWithCounts);
    };
    
    loadCategoriesWithProductCounts();
  }, [getAllProducts]);
  
  // Handle saving settings
  const saveSettings = () => {
    localStorage.setItem('vcsews-settings', JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };
  
  // Handle category edit
  const startEditingCategory = (categoryId: string) => {
    setEditingCategoryId(categoryId);
  };
  
  // Handle category update
  const updateCategory = async (category: CategoryWithProducts) => {
    try {
      setIsSubmitting(true);
      
      // Update in local state first
      setCategoryState(prev => 
        prev.map(c => c.id === category.id ? category : c)
      );
      
      // In a real implementation, this would update in a database
      // For now, we'll just show success and reset the editing state
      toast.success(`Category ${category.name} updated successfully`);
      setEditingCategoryId(null);
    } catch (error) {
      toast.error("Failed to update category");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Prepare to delete category
  const confirmDeleteCategory = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    
    // Set default replacement category (first category that's not the one being deleted)
    const firstOtherCategory = categoryState.find(c => c.id !== categoryId);
    if (firstOtherCategory) {
      setCategoryToReplaceWith(firstOtherCategory.id);
    }
  };
  
  // Handle actual category deletion with product reassignment
  const deleteCategory = async () => {
    if (!deletingCategoryId) return;
    
    try {
      setIsSubmitting(true);
      
      const categoryToDelete = categoryState.find(c => c.id === deletingCategoryId);
      if (!categoryToDelete) return;
      
      if (categoryToDelete.productCount > 0) {
        // Would need to reassign products to another category
        // For now just simulate the process
        toast.success(`${categoryToDelete.productCount} products reassigned to new category`);
      }
      
      // Remove from local state
      setCategoryState(prev => prev.filter(c => c.id !== deletingCategoryId));
      
      toast.success(`Category ${categoryToDelete.name} deleted successfully`);
      setDeletingCategoryId(null);
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cancel deletion
  const cancelDeleteCategory = () => {
    setDeletingCategoryId(null);
    setCategoryToReplaceWith("");
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-playfair">Store Settings</h2>
      </div>
      
      <Tabs defaultValue="description">
        <TabsList className="mb-6">
          <TabsTrigger value="description">Product Description</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>Default Product Description</CardTitle>
              <CardDescription>
                Edit the default description template used for new products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.defaultProductDescription}
                onChange={(e) => setSettings({...settings, defaultProductDescription: e.target.value})}
                rows={6}
                placeholder="Enter default product description"
                className="font-medium"
              />
              <p className="text-xs text-gray-500 mt-2">
                This description will be used as the default for all new products
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={saveSettings}
                className="bg-threadGold hover:bg-threadGold/90"
              >
                <SaveIcon className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                Manage your store categories (limited to 4 maximum)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryState.map(category => (
                  <div 
                    key={category.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    {editingCategoryId === category.id ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`name-${category.id}`}>Category Name</Label>
                          <Input
                            id={`name-${category.id}`}
                            value={category.name}
                            onChange={(e) => 
                              setCategoryState(prev => 
                                prev.map(c => c.id === category.id 
                                  ? {...c, name: e.target.value} 
                                  : c
                                )
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`slug-${category.id}`}>URL Slug</Label>
                          <Input
                            id={`slug-${category.id}`}
                            value={category.slug}
                            onChange={(e) => 
                              setCategoryState(prev => 
                                prev.map(c => c.id === category.id 
                                  ? {...c, slug: e.target.value} 
                                  : c
                                )
                              )
                            }
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Used in URLs: vcsews.com/category/{category.slug}
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor={`description-${category.id}`}>Description</Label>
                          <Textarea
                            id={`description-${category.id}`}
                            value={category.description}
                            onChange={(e) => 
                              setCategoryState(prev => 
                                prev.map(c => c.id === category.id 
                                  ? {...c, description: e.target.value} 
                                  : c
                                )
                              )
                            }
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingCategoryId(null)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="bg-threadGold hover:bg-threadGold/90"
                            onClick={() => updateCategory(category)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>Saving...</>
                            ) : (
                              <>
                                <SaveIcon className="h-4 w-4 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.description}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500 mr-2">Products:</span>
                              <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                                {category.productCount}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => startEditingCategory(category.id)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => confirmDeleteCategory(category.id)}
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                                    Delete Category?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {category.productCount > 0 ? (
                                      <>
                                        This category contains {category.productCount} products. 
                                        Deleting it will require reassigning these products to another category.
                                      </>
                                    ) : (
                                      <>
                                        Are you sure you want to delete this category? This action cannot be undone.
                                      </>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                
                                {category.productCount > 0 && (
                                  <div className="mb-4">
                                    <Label htmlFor="replacementCategory">Move products to:</Label>
                                    <select 
                                      id="replacementCategory"
                                      className="w-full border border-gray-300 rounded-md p-2 mt-1"
                                      value={categoryToReplaceWith}
                                      onChange={(e) => setCategoryToReplaceWith(e.target.value)}
                                    >
                                      {categoryState
                                        .filter(c => c.id !== category.id)
                                        .map(c => (
                                          <option key={c.id} value={c.id}>
                                            {c.name}
                                          </option>
                                        ))
                                      }
                                    </select>
                                  </div>
                                )}
                                
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={cancelDeleteCategory}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={deleteCategory}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  The store is limited to 4 categories for optimal navigation
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 