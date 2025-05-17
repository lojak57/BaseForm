import { useState, useEffect, useCallback } from "react";
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
import { PencilIcon, SaveIcon, Trash2Icon, AlertTriangle, Upload, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { uploadStoreLogo } from "@/lib/uploadStoreLogo";
import { Progress } from "@/components/ui/progress";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

// Default description template that will be editable
const DEFAULT_DESCRIPTION = "Handcrafted with care and attention to detail. This premium quality item is designed to be both functional and stylish. Made with high-quality materials that ensure durability and long-lasting performance.";

// Type for settings
interface SiteSettings {
  defaultProductDescription: string;
  logoUrl: string;
  primaryColor: string; // Main brand color (threadGold)
  textColor: string;   // Main text color (darkText)
  bgColor: string;     // Background color (ivory)
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
    defaultProductDescription: DEFAULT_DESCRIPTION,
    logoUrl: '/lovable-uploads/463dd640-f9c6-4abf-aa5f-4e6927af1de5.png', // Default logo
    primaryColor: '#D4AF37', // Default threadGold color
    textColor: '#1F1E1D',   // Default darkText color
    bgColor: '#FDFCF7'      // Default ivory color
  });
  
  // Logo upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  
  // Category management state
  const [categoryState, setCategoryState] = useState<CategoryWithProducts[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToReplaceWith, setCategoryToReplaceWith] = useState<string>("");
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('webshop-settings');
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
  
  // Handle logo file upload
  const handleLogoUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setUploadProgress(Math.min(progress, 95));
    }, 100);
    
    setIsUploading(true);
    
    try {
      // Upload file and get URL
      const { url, error } = await uploadStoreLogo(file);
      
      if (error) {
        throw error;
      }
      
      if (url) {
        // Update settings with new logo URL
        setSettings(prev => ({
          ...prev,
          logoUrl: url
        }));
        
        // Save updated settings to localStorage
        localStorage.setItem('webshop-settings', JSON.stringify({
          ...settings,
          logoUrl: url
        }));
        
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          toast.success("Logo updated successfully");
        }, 500);
      }
    } catch (error) {
      toast.error("Failed to upload logo: " + (error as Error).message);
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  }, [settings]);

  // Trigger file browser dialog
  const handleChooseFile = useCallback(() => {
    if (fileInputRef) {
      fileInputRef.click();
    }
  }, [fileInputRef]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleLogoUpload(e.target.files[0]);
    }
  }, [handleLogoUpload]);
  
  // Handle saving settings
  const saveSettings = () => {
    localStorage.setItem('webshop-settings', JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };
  
  // Handle category edit
  const startEditingCategory = (categoryId: string) => {
    setEditingCategoryId(categoryId);
  };
  
  // Handle category update
  const updateCategory = (category: CategoryWithProducts) => {
    try {
      // Update category in state
      setCategoryState(prev => prev.map(c => 
        c.id === category.id ? category : c
      ));
      
      // Reset editing state
      setEditingCategoryId(null);
      
      // Show success toast
      toast.success(`Category "${category.name}" updated successfully`);
      
      // In a real app, this would also update the database
      // For now, we just update the local state
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };
  
  // Prepare to delete category
  const confirmDeleteCategory = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    
    // If there are other categories, set the first one as default replacement
    const otherCategories = categoryState.filter(c => c.id !== categoryId);
    if (otherCategories.length > 0) {
      setCategoryToReplaceWith(otherCategories[0].id);
    }
  };
  
  // Handle actual category deletion with product reassignment
  const deleteCategory = () => {
    try {
      setIsSubmitting(true);
      
      // Get the category being deleted
      const categoryToDelete = categoryState.find(c => c.id === deletingCategoryId);
      
      if (!categoryToDelete) {
        throw new Error("Category not found");
      }
      
      // In a real app, this would update products in the database to reassign them
      // to the new category selected in categoryToReplaceWith
      
      // Remove the category from state
      setCategoryState(prev => prev.filter(c => c.id !== deletingCategoryId));
      
      // Reset state
      setDeletingCategoryId(null);
      setCategoryToReplaceWith("");
      
      // Show success message
      toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
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
    <div className="p-6">
      <h2 className="text-2xl font-bold font-playfair">Store Settings</h2>
      <p className="text-gray-500 mb-6">
        Configure your store settings, branding, manage categories, and account security
      </p>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Store Branding Card */}
            <Card>
              <CardHeader>
                <CardTitle>Store Branding</CardTitle>
                <CardDescription>Customize your store's logo and theme colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload Section */}
                <div>
                  <Label className="text-base font-semibold">Store Logo</Label>
                  <div className="flex flex-col md:flex-row gap-6 mt-2">
                    <div className="w-full md:w-1/3 bg-white p-4 border rounded-md flex items-center justify-center">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-threadGold mb-2" />
                          <Progress value={uploadProgress} className="w-full max-w-[150px] h-2" />
                          <p className="text-xs text-gray-500 mt-1">{Math.round(uploadProgress)}% complete</p>
                        </div>
                      ) : (
                        <img 
                          src={settings.logoUrl || '/placeholder-logo.png'} 
                          alt="Store Logo" 
                          className="max-h-24 max-w-full object-contain" 
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileInputChange}
                        ref={(ref) => setFileInputRef(ref)}
                      />
                      <Button 
                        onClick={handleChooseFile}
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={isUploading}
                      >
                        <Upload size={16} />
                        Upload New Logo
                      </Button>
                      <p className="text-xs text-gray-500">
                        Recommended size: 250x100px, PNG or JPEG, max 2MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Color Scheme Section */}
                <div>
                  <Label className="text-base font-semibold">Color Scheme</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <Label htmlFor="primaryColor" className="text-sm">Brand Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                          className="w-12 h-8 p-1 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                          className="w-24"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="textColor" className="text-sm">Text Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="textColor"
                          type="color"
                          value={settings.textColor}
                          onChange={(e) => setSettings({...settings, textColor: e.target.value})}
                          className="w-12 h-8 p-1 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={settings.textColor}
                          onChange={(e) => setSettings({...settings, textColor: e.target.value})}
                          className="w-24"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bgColor" className="text-sm">Background Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="bgColor"
                          type="color"
                          value={settings.bgColor}
                          onChange={(e) => setSettings({...settings, bgColor: e.target.value})}
                          className="w-12 h-8 p-1 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={settings.bgColor}
                          onChange={(e) => setSettings({...settings, bgColor: e.target.value})}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={saveSettings}
                  className="bg-threadGold hover:bg-threadGold/90"
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Branding Settings
                </Button>
              </CardFooter>
            </Card>
            
            {/* Product Description Template Card */}
            <Card>
              <CardHeader>
                <CardTitle>Product Description Template</CardTitle>
                <CardDescription>Create a default template for new product descriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter default product description..."
                  value={settings.defaultProductDescription}
                  onChange={(e) => setSettings({...settings, defaultProductDescription: e.target.value})}
                  className="min-h-[200px]"
                />
                <p className="text-sm text-gray-500 mt-2">
                  This template will be applied to new products by default, but can be customized per product.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={saveSettings}
                  className="bg-threadGold hover:bg-threadGold/90"
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Description Template
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Manage your store's product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryState.map(category => (
                  <div key={category.id} className="border rounded-md p-4 bg-white">
                    {editingCategoryId === category.id ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`name-${category.id}`}>Category Name</Label>
                          <Input
                            id={`name-${category.id}`}
                            value={category.name}
                            onChange={(e) => setCategoryState(prev => prev.map(c => 
                              c.id === category.id ? {...c, name: e.target.value} : c
                            ))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`slug-${category.id}`}>URL Slug</Label>
                          <Input
                            id={`slug-${category.id}`}
                            value={category.slug}
                            onChange={(e) => setCategoryState(prev => prev.map(c => 
                              c.id === category.id ? {...c, slug: e.target.value} : c
                            ))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`description-${category.id}`}>Description</Label>
                          <Textarea
                            id={`description-${category.id}`}
                            value={category.description}
                            onChange={(e) => setCategoryState(prev => prev.map(c => 
                              c.id === category.id ? {...c, description: e.target.value} : c
                            ))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-3">
                          <Button
                            variant="outline"
                            onClick={() => setEditingCategoryId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => updateCategory(category)}
                            className="bg-threadGold hover:bg-threadGold/90"
                          >
                            <SaveIcon className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded-md">
                              <img 
                                src={category.image || '/placeholder-category.png'} 
                                alt={category.name} 
                                className="w-10 h-10 object-cover rounded"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{category.name}</h3>
                              <p className="text-sm text-gray-500">{category.productCount} products</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditingCategory(category.id)}
                              className="hover:bg-gray-100"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
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

        {/* Account Tab */}
        <TabsContent value="account">
          <div className="max-w-lg mx-auto">
            <ChangePasswordForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
