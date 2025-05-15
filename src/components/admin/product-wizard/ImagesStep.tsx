import { useState, useCallback, useRef } from "react";
import { Product } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { uploadImages } from "@/lib/uploadImages";
import { Loader2, X, Upload, Image, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ImagesStepProps {
  product: Partial<Product>;
  updateField: (field: keyof Product, value: any) => void;
}

interface DropZoneProps {
  index: number;
  imageUrl: string;
  onFileChange: (file: File, index: number) => void;
  onUrlChange: (url: string, index: number) => void;
  isUploading: boolean;
  progress: number;
}

export function ImagesStep({ product, updateField }: ImagesStepProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Real implementation for file uploads using Supabase storage
  const handleFileUpload = useCallback(async (file: File, index: number) => {
    if (!file) return;
    
    // Reset errors
    setErrors([]);
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setErrors(prev => [...prev, `File ${file.name} is not an image.`]);
      return;
    }
    
    if (file.size > 20 * 1024 * 1024) { // 20MB limit (increased from 5MB)
      setErrors(prev => [...prev, `File ${file.name} exceeds 20MB size limit.`]);
      return;
    }
    
    setIsUploading(true);
    setUploadingIndex(index);
    setUploadProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        return newProgress > 90 ? 90 : newProgress; // Cap at 90% until complete
      });
    }, 300);
    
    try {
      // Use the slug as the folder name for organizing images
      // If slug is not available yet, use a timestamp
      const slug = product.slug || `temp-${Date.now()}`;
      
      // Upload the file to Supabase storage
      const urls = await uploadImages([file], slug);
      
      if (urls.length > 0) {
        // Set progress to 100% when complete
        setUploadProgress(100);
        
        // Update the image in the product state
        const newImages = [...(product.defaultImages || ["", "", ""])];
        newImages[index] = urls[0];
        updateField("defaultImages", newImages);
        
        toast.success(`Image ${index + 1} uploaded successfully`);
        
        // Reset after a short delay
        setTimeout(() => {
          setIsUploading(false);
          setUploadingIndex(null);
          setUploadProgress(0);
        }, 800);
      }
    } catch (error) {
      setErrors(prev => [...prev, `Failed to upload image: ${error.message || 'Unknown error'}`]);
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadingIndex(null);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  }, [product.defaultImages, product.slug, updateField]);

  const handleUrlChange = useCallback((url: string, index: number) => {
    const newImages = [...(product.defaultImages || ["", "", ""])];
    newImages[index] = url;
    updateField("defaultImages", newImages);
  }, [product.defaultImages, updateField]);

  // Clear an image
  const handleClearImage = useCallback((index: number) => {
    const newImages = [...(product.defaultImages || ["", "", ""])];
    newImages[index] = "";
    updateField("defaultImages", newImages);
    toast.info("Image cleared");
  }, [product.defaultImages, updateField]);

  return (
    <div className="space-y-4 relative">
      {/* Upload overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-threadGold mb-4" />
          <h3 className="text-lg font-medium mb-2">Uploading Image {uploadingIndex !== null ? uploadingIndex + 1 : ''}...</h3>
          <div className="w-64 mb-2">
            <Progress value={uploadProgress} className="h-2" />
          </div>
          <p className="text-sm text-gray-500">{Math.round(uploadProgress)}% complete</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment. Please don't close the page.</p>
        </div>
      )}

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h4 className="text-red-800 font-medium">Upload errors</h4>
              <ul className="list-disc ml-5 mt-1">
                {errors.map((err, i) => (
                  <li key={i} className="text-red-600 text-sm">{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'url' ? "default" : "outline"}
            onClick={() => setUploadMethod('url')}
            className={uploadMethod === 'url' ? "bg-threadGold hover:bg-threadGold/90" : ""}
          >
            <Image className="h-4 w-4 mr-2" />
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
                isUploading={isUploading && uploadingIndex === 0}
                progress={uploadingIndex === 0 ? uploadProgress : 0}
              />
            ) : (
              <div className="relative">
                <Input 
                  id="mainImage"
                  placeholder="/images/products/category/product-name.jpg"
                  value={product.defaultImages?.[0] || ""}
                  onChange={(e) => handleUrlChange(e.target.value, 0)}
                  required
                />
                {product.defaultImages?.[0] && (
                  <Button 
                    size="icon"
                    variant="ghost" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={() => handleClearImage(0)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
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
                isUploading={isUploading && uploadingIndex === 1}
                progress={uploadingIndex === 1 ? uploadProgress : 0}
              />
            ) : (
              <div className="relative">
                <Input 
                  id="detailImage"
                  placeholder="/images/products/category/product-name-detail.jpg"
                  value={product.defaultImages?.[1] || ""}
                  onChange={(e) => handleUrlChange(e.target.value, 1)}
                />
                {product.defaultImages?.[1] && (
                  <Button 
                    size="icon"
                    variant="ghost" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={() => handleClearImage(1)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
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
                isUploading={isUploading && uploadingIndex === 2}
                progress={uploadingIndex === 2 ? uploadProgress : 0}
              />
            ) : (
              <div className="relative">
                <Input 
                  id="insideImage"
                  placeholder="/images/products/category/product-name-inside.jpg"
                  value={product.defaultImages?.[2] || ""}
                  onChange={(e) => handleUrlChange(e.target.value, 2)}
                />
                {product.defaultImages?.[2] && (
                  <Button 
                    size="icon"
                    variant="ghost" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={() => handleClearImage(2)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Label>Image Preview</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {(product.defaultImages || ["", "", ""]).map((img, index) => (
            <div key={index} className="relative border rounded overflow-hidden h-40 group">
              {img ? (
                <>
                  <img 
                    src={img} 
                    alt={`Product ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button 
                      onClick={() => handleClearImage(index)}
                      variant="destructive"
                      size="sm"
                      className="transition-transform transform scale-90 hover:scale-100"
                    >
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              {/* Show image number indicator */}
              <div className="absolute top-2 left-2 bg-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium shadow-sm">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DropZone({ index, imageUrl, onFileChange, onUrlChange, isUploading, progress }: DropZoneProps) {
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
      } ${isUploading ? 'bg-gray-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileInputChange}
        disabled={isUploading}
      />
      
      {isUploading && (
        <div className="absolute inset-0 bg-gray-50/90 flex flex-col items-center justify-center rounded-md">
          <Loader2 className="h-6 w-6 animate-spin text-threadGold mb-2" />
          <div className="w-full px-4 mb-1">
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-xs text-gray-600">{Math.round(progress)}% complete</p>
        </div>
      )}
      
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
            <span className="text-sm text-gray-600">
              {isUploading ? "Uploading..." : "Click or drop to replace"}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Upload className="h-10 w-10 mb-2" />
            <span>{isUploading ? "Uploading..." : "Click or drop to upload"}</span>
            <span className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF (max 20MB)</span>
          </div>
        )}
      </div>
    </div>
  );
} 