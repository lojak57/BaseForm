import { useState, useCallback, useRef } from "react";
import { Fabric } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFabrics, FabricItem } from "@/context/FabricContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface FabricFormProps {
  addFabric: (fabric: Fabric) => void;
}

interface ImageDropZoneProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  label: string;
  placeholder: string;
  required?: boolean;
}

export function FabricForm({ addFabric }: FabricFormProps) {
  const { fabrics, loading } = useFabrics();
  const [inputMethod, setInputMethod] = useState<'manual' | 'library'>('library');
  
  // Manual entry state
  const [fabricCode, setFabricCode] = useState("");
  const [fabricLabel, setFabricLabel] = useState("");
  const [fabricUpcharge, setFabricUpcharge] = useState(0);
  const [fabricSwatch, setFabricSwatch] = useState("");
  const [fabricImage, setFabricImage] = useState("");
  
  // Library selection state
  const [selectedFabricId, setSelectedFabricId] = useState<string>("");
  const [filterByColor, setFilterByColor] = useState<string>("all");
  const [customUpcharge, setCustomUpcharge] = useState<number | null>(null);
  const [customImage, setCustomImage] = useState<string>("");
  
  // Handle manual fabric submission
  const handleManualSubmit = () => {
    if (!fabricCode || !fabricLabel || !fabricSwatch) {
      toast.error("Please fill in all required fabric fields");
      return;
    }
    
    const newFabric: Fabric = {
      code: fabricCode,
      label: fabricLabel,
      upcharge: fabricUpcharge,
      swatch: fabricSwatch,
    };
    
    if (fabricImage) {
      newFabric.imgOverride = [fabricImage];
    }
    
    addFabric(newFabric);
    
    // Reset form
    setFabricCode("");
    setFabricLabel("");
    setFabricUpcharge(0);
    setFabricSwatch("");
    setFabricImage("");
  };
  
  // Handle library fabric selection
  const handleLibrarySubmit = () => {
    if (!selectedFabricId) {
      toast.error("Please select a fabric from the library");
      return;
    }
    
    const libraryFabric = fabrics.find(f => f.id === selectedFabricId);
    if (!libraryFabric) {
      toast.error("Selected fabric not found");
      return;
    }
    
    const newFabric: Fabric = {
      code: libraryFabric.code,
      label: libraryFabric.name,
      upcharge: customUpcharge !== null ? customUpcharge : libraryFabric.price,
      swatch: libraryFabric.swatch,
    };
    
    if (customImage) {
      newFabric.imgOverride = [customImage];
    } else if (libraryFabric.images && libraryFabric.images.length > 0) {
      newFabric.imgOverride = libraryFabric.images;
    }
    
    addFabric(newFabric);
    
    // Reset form
    setSelectedFabricId("");
    setCustomUpcharge(null);
    setCustomImage("");
  };
  
  // Filter fabrics by color
  const filteredFabrics = filterByColor === 'all'
    ? fabrics
    : fabrics.filter(fabric => fabric.color === filterByColor);
    
  // Get available color options from fabric library
  const colorOptions = Array.from(new Set(fabrics.map(fabric => fabric.color))).sort();
  
  return (
    <div>
      <Tabs defaultValue="library" onValueChange={(value) => setInputMethod(value as 'manual' | 'library')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="library">Select from Library</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        
        {/* Library selection tab */}
        <TabsContent value="library" className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading fabric library...</div>
          ) : fabrics.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-2">No fabrics found in library.</p>
              <p className="text-sm">You can add fabrics in the Fabric Library page or enter details manually.</p>
            </div>
          ) : (
            <>
              {/* Filter controls */}
              <div className="mb-4">
                <Label className="block mb-2">Filter by Color</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    onClick={() => setFilterByColor('all')}
                    className={`cursor-pointer ${filterByColor === 'all' ? 'bg-threadGold' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                  >
                    All
                  </Badge>
                  {colorOptions.map(color => (
                    <Badge
                      key={color}
                      onClick={() => setFilterByColor(color)}
                      className={`cursor-pointer ${filterByColor === color ? 'bg-threadGold' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Fabric selection grid */}
              <ScrollArea className="h-[300px] border rounded-md p-2">
                <div className="grid grid-cols-2 gap-3">
                  {filteredFabrics.map(fabric => (
                    <Card 
                      key={fabric.id} 
                      className={`cursor-pointer overflow-hidden transition-all ${
                        selectedFabricId === fabric.id 
                          ? 'ring-2 ring-threadGold' 
                          : 'hover:border-threadGold/50'
                      }`}
                      onClick={() => setSelectedFabricId(fabric.id)}
                    >
                      <div className="aspect-square">
                        <img
                          src={fabric.swatch}
                          alt={fabric.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm">{fabric.name}</h3>
                            <p className="text-xs text-gray-500">Code: {fabric.code}</p>
                            {fabric.price > 0 && (
                              <p className="text-xs font-medium">+${fabric.price.toFixed(2)} upcharge</p>
                            )}
                          </div>
                          <Badge className="bg-gray-200 text-gray-800 text-xs">
                            {fabric.color.charAt(0).toUpperCase() + fabric.color.slice(1)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Custom options for selected fabric */}
              {selectedFabricId && (
                <div className="space-y-3 pt-2 border-t mt-3">
                  <h3 className="font-medium">Customize for this product (optional)</h3>
                  
                  <div>
                    <Label htmlFor="customUpcharge">Custom Upcharge ($)</Label>
                    <Input
                      id="customUpcharge"
                      type="number"
                      min="0"
                      step="0.01"
                      value={customUpcharge ?? ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        setCustomUpcharge(value);
                      }}
                      placeholder="Use default price from library"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Override the default upcharge for this product only</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="customImage">Custom Product Image</Label>
                    <ImageDropZone
                      imageUrl={customImage}
                      onImageChange={setCustomImage}
                      label="Upload custom product image with this fabric"
                      placeholder="/images/products/category/product-name-fabric.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Override the default fabric images for this product</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleLibrarySubmit} 
                disabled={!selectedFabricId}
                className="w-full bg-threadGold hover:bg-threadGold/90 mt-2"
              >
                Add Selected Fabric
              </Button>
            </>
          )}
        </TabsContent>
        
        {/* Manual entry tab */}
        <TabsContent value="manual" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fabricCode">Fabric Code*</Label>
              <Input 
                id="fabricCode"
                value={fabricCode}
                onChange={(e) => setFabricCode(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="fabricLabel">Fabric Name*</Label>
              <Input 
                id="fabricLabel"
                value={fabricLabel}
                onChange={(e) => setFabricLabel(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fabricUpcharge">Price Upcharge ($)</Label>
              <Input 
                id="fabricUpcharge"
                type="number"
                min="0"
                value={fabricUpcharge}
                onChange={(e) => setFabricUpcharge(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="fabricSwatch">Fabric Swatch Image*</Label>
            <ImageDropZone
              imageUrl={fabricSwatch}
              onImageChange={setFabricSwatch}
              label="Upload fabric swatch"
              placeholder="/images/swatches/fabric-name.jpg"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="fabricImage">Product Image with this Fabric (optional)</Label>
            <ImageDropZone
              imageUrl={fabricImage}
              onImageChange={setFabricImage}
              label="Upload product with this fabric"
              placeholder="/images/products/category/product-name-fabric.jpg"
            />
          </div>
          
          <Button onClick={handleManualSubmit} className="w-full bg-threadGold hover:bg-threadGold/90">
            Add Fabric Option
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ImageDropZone({ imageUrl, onImageChange, label, placeholder, required }: ImageDropZoneProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    try {
      // In a real implementation, this would upload to a server
      // For now, we'll create a local URL
      const localUrl = URL.createObjectURL(file);
      onImageChange(localUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    }
  }, [onImageChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  }, [handleFileUpload]);

  return (
    <div>
      <Tabs defaultValue="file" onValueChange={(value) => setUploadMethod(value as 'file' | 'url')}>
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="file">Upload File</TabsTrigger>
          <TabsTrigger value="url">Use URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="file">
          <div
            className={`border-2 border-dashed rounded-md p-6 relative ${
              isDragging ? 'border-threadGold bg-threadGold/10' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            
            <div className="text-center cursor-pointer">
              {imageUrl ? (
                <div className="flex items-center justify-center flex-col">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="h-20 object-cover rounded mb-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                    }}
                  />
                  <p className="text-sm text-gray-500">Click or drop to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500 mb-1">{label}</p>
                  <p className="text-xs text-gray-400">or drag and drop</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="url">
          <Input 
            placeholder={placeholder}
            value={imageUrl}
            onChange={(e) => onImageChange(e.target.value)}
            required={required}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 