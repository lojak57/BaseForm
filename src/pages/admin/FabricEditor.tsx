import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useFabrics, FabricItem, COLOR_OPTIONS } from "@/context/FabricContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { slugify } from "@/lib/utils";
import { generateFabricCode, uploadFabricImage } from "@/lib/uploadFabric";
import { DropZone } from "@/components/admin/fabric/DropZone";

export default function FabricEditor() {
  const navigate = useNavigate();
  const { fabricId } = useParams();
  const isEditing = !!fabricId;
  
  const { 
    addFabric, 
    updateFabric, 
    getFabricById, 
    refreshFabrics,
    loading: contextLoading 
  } = useFabrics();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  
  // Fabric form state
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
  
  // Image upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Load fabric data if editing
  useEffect(() => {
    if (isEditing && fabricId) {
      setLoading(true);
      
      // Get the existing fabric details
      const existingFabric = getFabricById(fabricId);
      
      if (existingFabric) {
        // Pre-fill the form with existing values
        setFabricForm({
          code: existingFabric.code,
          name: existingFabric.name,
          description: existingFabric.description,
          color: existingFabric.color,
          customColor: existingFabric.customColor || '',
          price: existingFabric.price,
          swatch: existingFabric.swatch,
          inStock: existingFabric.inStock,
          sortOrder: existingFabric.sortOrder,
          images: existingFabric.images
        });
      } else {
        // Fabric not found, fetch fresh data or redirect
        refreshFabrics().then(() => {
          const refreshedFabric = getFabricById(fabricId);
          
          if (refreshedFabric) {
            setFabricForm({
              code: refreshedFabric.code,
              name: refreshedFabric.name,
              description: refreshedFabric.description,
              color: refreshedFabric.color,
              customColor: refreshedFabric.customColor || '',
              price: refreshedFabric.price,
              swatch: refreshedFabric.swatch,
              inStock: refreshedFabric.inStock,
              sortOrder: refreshedFabric.sortOrder,
              images: refreshedFabric.images
            });
          } else {
            toast.error("Fabric not found");
            navigate("/admin/fabrics");
          }
        }).finally(() => {
          setLoading(false);
        });
      }
      
      setLoading(false);
    }
  }, [isEditing, fabricId, getFabricById, refreshFabrics, navigate]);
  
  // Handle fabric form field changes
  const handleFormChange = (field: keyof typeof fabricForm, value: any) => {
    setFabricForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Auto-generate a unique fabric code based on name
  const generateCode = useCallback(() => {
    if (fabricForm.name) {
      const generatedCode = generateFabricCode(fabricForm.name);
      setFabricForm(prev => ({
        ...prev,
        code: generatedCode
      }));
      toast.success("Unique fabric code generated");
    } else {
      toast.error("Please enter a fabric name first");
    }
  }, [fabricForm.name]);
  
  // Handle image upload for fabric swatch
  const handleSwatchUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      toast.error("File exceeds 20MB size limit");
      return;
    }
    
    // Ensure we have a fabric code for the upload path
    const uploadCode = fabricForm.code || generateFabricCode(fabricForm.name || 'temp');
    if (!fabricForm.code) {
      setFabricForm(prev => ({
        ...prev,
        code: uploadCode
      }));
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 300);
    
    try {
      // Upload the image and get the URL
      const imageUrl = await uploadFabricImage(file, uploadCode);
      
      // Update the form with the image URL
      setFabricForm(prev => ({
        ...prev,
        swatch: imageUrl
      }));
      
      setUploadProgress(100);
      toast.success("Fabric swatch uploaded successfully");
      
      // Reset after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 800);
    } catch (error) {
      toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  }, [fabricForm.code, fabricForm.name]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!fabricForm.name || !fabricForm.code || !fabricForm.swatch) {
        toast.error('Name, code, and swatch image are required');
        return;
      }

      if (isEditing && fabricId) {
        // Get the existing fabric to preserve metadata
        const existingFabric = getFabricById(fabricId);
        
        if (!existingFabric) {
          toast.error('Fabric not found');
          return;
        }

        // Update existing fabric
        await updateFabric({
          ...fabricForm,
          id: fabricId,
          createdAt: existingFabric.createdAt,
          updatedAt: new Date().toISOString()
        });

        toast.success('Fabric updated successfully');
      } else {
        // Add new fabric
        await addFabric(fabricForm);
        toast.success('Fabric added successfully');
      }

      // Redirect back to fabrics page
      navigate('/admin/fabrics');
      
    } catch (err) {
      console.error('Error submitting fabric:', err);
      toast.error('An error occurred while saving the fabric');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-threadGold mr-2" />
        <span>Loading fabric data...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/fabrics')}
          className="rounded-full p-2 h-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-playfair">
          {isEditing ? 'Edit Fabric' : 'Add New Fabric'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="flex gap-2">
                    <Input 
                      id="fabricCode" 
                      value={fabricForm.code} 
                      onChange={e => handleFormChange('code', e.target.value)} 
                      placeholder="unique-identifier"
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateCode}
                      disabled={!fabricForm.name || isEditing}
                      title={isEditing ? "Cannot change code when editing" : "Generate unique code"}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    A unique code for this fabric. Click the refresh button to auto-generate.
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
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Media & Availability</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fabricSwatch">Fabric Swatch Image *</Label>
                  <DropZone
                    imageUrl={fabricForm.swatch}
                    onFileChange={handleSwatchUpload}
                    onUrlChange={(url) => handleFormChange('swatch', url)}
                    isUploading={isUploading}
                    progress={uploadProgress}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {fabricForm.swatch ? 
                      'Click or drag to upload a different image' : 
                      'Click or drag to upload a fabric swatch image'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="inStock" 
                    checked={fabricForm.inStock} 
                    onCheckedChange={(checked) => handleFormChange('inStock', checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                
                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input 
                    id="sortOrder" 
                    type="number" 
                    min="0" 
                    step="1" 
                    value={fabricForm.sortOrder.toString()} 
                    onChange={e => handleFormChange('sortOrder', parseInt(e.target.value) || 0)} 
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Determines the display order (lower numbers appear first)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => navigate('/admin/fabrics')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
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
                {isEditing ? 'Update Fabric' : 'Add Fabric'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
