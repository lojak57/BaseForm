import { useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Loader2, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DropZoneProps {
  imageUrl: string;
  onFileChange: (file: File) => void;
  onUrlChange?: (url: string) => void;
  isUploading: boolean;
  progress: number;
}

export function DropZone({ 
  imageUrl, 
  onFileChange, 
  onUrlChange, 
  isUploading, 
  progress 
}: DropZoneProps) {
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
        onFileChange(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  }, [onFileChange]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onFileChange(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  }, [onFileChange]);

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
              alt="Fabric Swatch Preview" 
              className="h-32 object-cover rounded mb-2"
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
