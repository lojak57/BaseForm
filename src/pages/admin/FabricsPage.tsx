import { useState } from "react";
import { Link } from "react-router-dom";
import { useFabrics, FabricItem, COLOR_OPTIONS } from "@/context/FabricContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, PlusCircle, Pencil, Trash2, ImagePlus, Save, X, Check, AlertTriangle, FileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function FabricsPage() {
  const {
    fabrics,
    loading,
    error,
    addFabric,
    updateFabric,
    deleteFabric,
    refreshFabrics
  } = useFabrics();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFabricId, setEditingFabricId] = useState<string | null>(null);
  const [deletingFabricId, setDeletingFabricId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterByColor, setFilterByColor] = useState<string>('all');

  // New fabric form state
  const [fabricForm, setFabricForm] = useState<Omit<FabricItem, 'id' | 'createdAt' | 'updatedAt'>>({
    code: '',
    name: '',
    description: '',
    color: '',
    customColor: '',
    price: 0,
    swatch: '',
    inStock: true,
    sortOrder: 0,
    images: []
  });

  // Reset form for adding new fabric
  const resetForm = () => {
    setFabricForm({
      code: '',
      name: '',
      description: '',
      color: '',
      customColor: '',
      price: 0,
      swatch: '',
      inStock: true,
      sortOrder: fabrics.length, // Default to last position
      images: []
    });
  };

  // Setup form for editing
  const editFabric = (fabric: FabricItem) => {
    setFabricForm({
      code: fabric.code,
      name: fabric.name,
      description: fabric.description,
      color: fabric.color,
      customColor: fabric.customColor || '',
      price: fabric.price,
      swatch: fabric.swatch,
      inStock: fabric.inStock,
      sortOrder: fabric.sortOrder,
      images: fabric.images
    });
    setEditingFabricId(fabric.id);
  };

  // Get fabric by id
  const getFabricById = (id: string): FabricItem | undefined => {
    return fabrics.find(fabric => fabric.id === id);
  };

  // Handle fabric form field changes
  const handleFormChange = (field: keyof typeof fabricForm, value: any) => {
    setFabricForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate code from name if creating new fabric
    if (field === 'name' && !editingFabricId && !fabricForm.code) {
      const code = slugify(value).substring(0, 20);
      setFabricForm(prev => ({
        ...prev,
        code
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!fabricForm.name || !fabricForm.code || !fabricForm.swatch) {
        toast.error('Name, code, and swatch image are required');
        return;
      }

      if (editingFabricId) {
        // Update existing fabric
        const existingFabric = getFabricById(editingFabricId);
        if (!existingFabric) {
          toast.error('Fabric not found');
          return;
        }

        await updateFabric({
          ...fabricForm,
          id: editingFabricId,
          createdAt: existingFabric.createdAt,
          updatedAt: new Date().toISOString()
        });

        toast.success('Fabric updated successfully');
      } else {
        // Add new fabric
        await addFabric(fabricForm);
        toast.success('Fabric added successfully');
      }

      // Reset form and close dialog
      resetForm();
      setIsAddDialogOpen(false);
      setEditingFabricId(null);
    } catch (err) {
      console.error('Error submitting fabric:', err);
      toast.error('An error occurred while saving the fabric');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle fabric deletion
  const handleDelete = async () => {
    if (!deletingFabricId) return;

    try {
      setIsSubmitting(true);
      await deleteFabric(deletingFabricId);
      toast.success('Fabric deleted');
      setDeletingFabricId(null);
    } catch (err) {
      console.error('Error deleting fabric:', err);
      toast.error('An error occurred while deleting the fabric');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter fabrics by color
  const filteredFabrics = filterByColor === 'all'
    ? fabrics
    : fabrics.filter(fabric => fabric.color === filterByColor);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-threadGold mr-2" />
        <span>Loading fabric library...</span>
      </div>
    );
  }

  // Error state - likely the fabric_library table doesn't exist
  if (error) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-2" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">Fabric Library Setup Required</h3>
          <p className="text-gray-600 mb-4">
            The fabric library table doesn't exist yet. You'll need to run the setup SQL script to create it.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left text-sm text-amber-800 mb-4 font-mono overflow-auto">
            <p>1. Go to your Supabase dashboard</p>
            <p>2. Open the SQL Editor</p>
            <p>3. Run the <code>create-fabric-library-table.sql</code> script we've created</p>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => refreshFabrics()}
              className="mx-2"
            >
              <Loader2 className="h-4 w-4 mr-2" />
              Refresh After Setup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - no fabrics added yet
  if (fabrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Fabrics Added Yet</h3>
          <p className="text-gray-500 mb-6">
            Your fabric library is empty. Add your first fabric to get started.
          </p>
          <Link to="/admin/fabrics/new">
            <Button 
              className="bg-threadGold hover:bg-threadGold/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Fabric
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Main fabric library view
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-playfair mb-2">Fabric Library</h2>
          <p className="text-gray-500">
            Manage fabric options that can be used across your products
          </p>
        </div>
        
        <Link to="/admin/fabrics/new">
          <Button 
            className="bg-threadGold hover:bg-threadGold/90"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Fabric
          </Button>
        </Link>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={filterByColor === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterByColor('all')}
          className={filterByColor === 'all' ? "bg-threadGold hover:bg-threadGold/90" : ""}
        >
          All
        </Button>
        {COLOR_OPTIONS.map(color => (
          <Button
            key={color}
            variant={filterByColor === color ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterByColor(color)}
            className={filterByColor === color ? "bg-threadGold hover:bg-threadGold/90" : ""}
          >
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </Button>
        ))}
      </div>

      {/* Fabric grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {filteredFabrics.map(fabric => (
          <Card key={fabric.id} className="overflow-hidden">
            <div className="aspect-square relative bg-gray-100">
              <img
                src={fabric.swatch}
                alt={fabric.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
              {!fabric.inStock && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Out of Stock
                </Badge>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">
                    {fabric.name}
                  </CardTitle>
                  {fabric.customColor && (
                    <p className="text-sm text-gray-500">{fabric.customColor}</p>
                  )}
                </div>
                <Badge className="bg-gray-200 text-gray-800">
                  {fabric.color.charAt(0).toUpperCase() + fabric.color.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2 text-sm">
              <p className="line-clamp-2 text-gray-500">{fabric.description || 'No description available'}</p>
              {fabric.price > 0 && (
                <p className="mt-1 font-medium">+${fabric.price.toFixed(2)} upcharge</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Link to={`/admin/fabrics/edit/${fabric.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setDeletingFabricId(fabric.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      Delete Fabric
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{fabric.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingFabricId(null)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add/Edit Fabric Dialog */}
      <div id="fabric-dialog" className={`fixed inset-0 bg-black/50 z-50 ${isAddDialogOpen ? 'flex' : 'hidden'} items-center justify-center p-4 overflow-y-auto`}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {editingFabricId ? 'Edit Fabric' : 'Add New Fabric'}
                  </h2>
                  <p className="text-gray-500">
                    {editingFabricId ? 
                      'Update fabric details and properties' : 
                      'Add a new fabric to your library that can be used across products'}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fabricName">Fabric Name *</Label>
                    <Input 
                      id="fabricName" 
                      value={fabricForm.name} 
                      onChange={e => handleFormChange('name', e.target.value)} 
                      placeholder="E.g., Cotton Twill"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fabricCode">Fabric Code *</Label>
                    <Input 
                      id="fabricCode" 
                      value={fabricForm.code} 
                      onChange={e => handleFormChange('code', e.target.value)} 
                      placeholder="unique-identifier"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A unique code for this fabric (auto-generated from name but can be changed)
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="fabricDescription">Description</Label>
                    <Textarea 
                      id="fabricDescription" 
                      value={fabricForm.description} 
                      onChange={e => handleFormChange('description', e.target.value)} 
                      placeholder="Describe the fabric..."
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fabricColor">Color Category *</Label>
                    <Select 
                      value={fabricForm.color} 
                      onValueChange={(value) => handleFormChange('color', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_OPTIONS.map(color => (
                          <SelectItem key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="customColor">Custom Color Name</Label>
                    <Input 
                      id="customColor" 
                      value={fabricForm.customColor || ''} 
                      onChange={e => handleFormChange('customColor', e.target.value)} 
                      placeholder="E.g., Sky Blue, Ruby Red, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fabricPrice">Upcharge Amount ($)</Label>
                    <Input 
                      id="fabricPrice" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={fabricForm.price.toString()} 
                      onChange={e => handleFormChange('price', parseFloat(e.target.value) || 0)} 
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Additional cost when this fabric is selected for a product
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="fabricSwatch">Swatch Image URL *</Label>
                    <Input 
                      id="fabricSwatch" 
                      value={fabricForm.swatch} 
                      onChange={e => handleFormChange('swatch', e.target.value)} 
                      placeholder="https://example.com/fabric-swatch.jpg"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="inStock" 
                      checked={fabricForm.inStock} 
                      onCheckedChange={(checked) => handleFormChange('inStock', checked)}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                  setEditingFabricId(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-threadGold hover:bg-threadGold/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingFabricId ? 'Update Fabric' : 'Add Fabric'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
