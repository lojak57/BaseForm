import { supabase } from "@/integrations/supabase/client";

export async function uploadStoreLogo(
  file: File
): Promise<string> {
  try {
    // Create a path for the store logo with timestamp to avoid caching issues
    const path = `store/logo-${Date.now()}.${file.name.split('.').pop()}`;
    // Sanitize the path to remove any problematic characters
    const sanitizedPath = path.replace(/[^a-zA-Z0-9_\/\-\.]/g, '_');
    
    console.log(`Attempting to upload store logo to path: ${sanitizedPath}`);
    
    // Upload the file to the product-images bucket
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(sanitizedPath, file, { upsert: true });
        
    if (error) {
      console.error("Logo upload error details:", error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(sanitizedPath);
      
    if (urlData?.publicUrl) {
      console.log("Logo upload successful:", urlData.publicUrl);
      return urlData.publicUrl;
    }
    
    throw new Error("Failed to get public URL for uploaded logo");
  } catch (error) {
    console.error("Logo upload error:", error);
    throw error;
  }
}
