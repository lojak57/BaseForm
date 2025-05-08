import { useState, useCallback, useRef } from "react";
import { Product } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface ImagesStepProps {
  product: Partial<Product>;
  updateField: (field: keyof Product, value: any) => void;
}

interface DropZoneProps {
  index: number;
  imageUrl: string;
  onFileChange: (file: File, index: number) => void;
  onUrlChange: (url: string, index: number) => void;
}

export function ImagesStep({ product, updateField }: ImagesStepProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [isUploading, setIsUploading] = useState(false);

  // Mock function to handle file uploads
  // In a real app, this would upload to a storage service
  const handleFileUpload = useCallback(async (file: File, index: number) => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // In a real implementation, you would upload to a server/cloud storage
      // For now, we'll create a local URL to simulate upload
      const localUrl = URL.createObjectURL(file);
      
      // Update the image in the product state
      const newImages = [...(product.defaultImages || ["", "", ""])];
      newImages[index] = localUrl;
      updateField("defaultImages", newImages);
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  }, [product.defaultImages, updateField]);

  const handleUrlChange = useCallback((url: string, index: number) => {
    const newImages = [...(product.defaultImages || ["", "", ""])];
    newImages[index] = url;
    updateField("defaultImages", newImages);
  }, [product.defaultImages, updateField]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Default Product Images*</Label>
        <p className="text-sm text-gray-500 mb-2">
          Add the main product images. At least one is required.
        </p>

        <div className="flex space-x-2 mb-4">
          <Button
            type="button"
            variant={uploadMethod === 'file' ? "default" : "outline"}
            onClick={() => setUploadMethod('file')}
            className={uploadMethod === 'file' ? "bg-threadGold hover:bg-threadGold/90" : ""}
          >
            Upload Files
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'url' ? "default" : "outline"}
            onClick={() => setUploadMethod('url')}
            className={uploadMethod === 'url' ? "bg-threadGold hover:bg-threadGold/90" : ""}
          >
            Use URL
          </Button>
        </div>
        
        <div className="space-y-5">
          <div>
            <Label htmlFor="mainImage">Main Product Image*</Label>
            {uploadMethod === 'file' ? (
              <DropZone
                index={0}
                imageUrl={product.defaultImages?.[0] || ""}
                onFileChange={handleFileUpload}
                onUrlChange={handleUrlChange}
              />
            ) : (
              <Input 
                id="mainImage"
                placeholder="/images/products/category/product-name.jpg"
                value={product.defaultImages?.[0] || ""}
                onChange={(e) => handleUrlChange(e.target.value, 0)}
                required
              />
            )}
          </div>
          
          <div>
            <Label htmlFor="detailImage">Detail Image</Label>
            {uploadMethod === 'file' ? (
              <DropZone
                index={1}
                imageUrl={product.defaultImages?.[1] || ""}
                onFileChange={handleFileUpload}
                onUrlChange={handleUrlChange}
              />
            ) : (
              <Input 
                id="detailImage"
                placeholder="/images/products/category/product-name-detail.jpg"
                value={product.defaultImages?.[1] || ""}
                onChange={(e) => handleUrlChange(e.target.value, 1)}
              />
            )}
          </div>
          
          <div>
            <Label htmlFor="insideImage">Inside Image</Label>
            {uploadMethod === 'file' ? (
              <DropZone
                index={2}
                imageUrl={product.defaultImages?.[2] || ""}
                onFileChange={handleFileUpload}
                onUrlChange={handleUrlChange}
              />
            ) : (
              <Input 
                id="insideImage"
                placeholder="/images/products/category/product-name-inside.jpg"
                value={product.defaultImages?.[2] || ""}
                onChange={(e) => handleUrlChange(e.target.value, 2)}
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Label>Image Preview</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {(product.defaultImages || ["", "", ""]).map((img, index) => (
            <div key={index} className="border rounded overflow-hidden h-40">
              {img ? (
                <img 
                  src={img} 
                  alt={`Product ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DropZone({ index, imageUrl, onFileChange, onUrlChange }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        onFileChange(file, index);
      } else {
        toast.error("Please upload an image file");
      }
    }
  }, [index, onFileChange]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onFileChange(file, index);
      } else {
        toast.error("Please upload an image file");
      }
    }
  }, [index, onFileChange]);

  return (
    <div
      className={`mt-1 border-2 border-dashed rounded-md p-6 relative ${
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
            <p className="text-sm text-gray-500 mb-1">Click to browse files</p>
            <p className="text-xs text-gray-400">or drag and drop</p>
          </div>
        )}
      </div>
    </div>
  );
} 