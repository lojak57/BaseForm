import { useState, useCallback, useRef } from "react";
import { Fabric } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [fabricCode, setFabricCode] = useState("");
  const [fabricLabel, setFabricLabel] = useState("");
  const [fabricUpcharge, setFabricUpcharge] = useState(0);
  const [fabricSwatch, setFabricSwatch] = useState("");
  const [fabricImage, setFabricImage] = useState("");
  
  const handleSubmit = () => {
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
  
  return (
    <div className="space-y-4">
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
      
      <Button onClick={handleSubmit} className="w-full bg-threadGold hover:bg-threadGold/90">
        Add Fabric Option
      </Button>
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