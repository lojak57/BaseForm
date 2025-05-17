import { supabase } from "@/integrations/supabase/client";

export async function uploadFabricImage(
  file: File,
  code: string
): Promise<string> {
  try {
    // Create a path for the fabric image using the fabric code
    const path = `fabrics/${code}/${Date.now()}-${file.name}`;
    // Sanitize the path to remove any problematic characters
    const sanitizedPath = path.replace(/[^a-zA-Z0-9_\/\-\.]/g, '_');
    
    console.log(`Attempting to upload fabric swatch to path: ${sanitizedPath}`);
    
    // Upload the file to the product-images bucket (in a fabric/ subdirectory)
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(sanitizedPath, file, { upsert: true });
        
    if (error) {
      console.error("Fabric upload error details:", error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(sanitizedPath);
      
    if (urlData?.publicUrl) {
      console.log("Fabric upload successful:", urlData.publicUrl);
      return urlData.publicUrl;
    }
    
    throw new Error("Failed to get public URL for uploaded fabric image");
  } catch (error) {
    console.error("Fabric upload error:", error);
    throw error;
  }
}

// Generate a unique fabric code based on name and timestamp
export function generateFabricCode(name: string): string {
  // Convert name to lowercase, replace spaces with hyphens
  const base = name.toLowerCase().replace(/\s+/g, '-');
  
  // Remove any special characters
  const sanitized = base.replace(/[^a-z0-9-]/g, '');
  
  // Add a timestamp suffix to ensure uniqueness
  const timestamp = Date.now().toString().slice(-6);
  
  // Truncate if too long and append timestamp
  const maxBaseLength = 14; // 14 + 1 + 6 = 21 characters max
  const truncated = sanitized.substring(0, maxBaseLength);
  
  return `${truncated}-${timestamp}`;
}
