import { supabase } from "@/integrations/supabase/client";

export async function uploadImages(
  files: File[],
  slug: string
): Promise<string[]> {
  const uploadedUrls: string[] = [];
  
  try {
    for (const file of files) {
      const path = `${slug}/${Date.now()}-${file.name}`;
      // Sanitize the path to remove any problematic characters
      const sanitizedPath = path.replace(/[^a-zA-Z0-9_\/\-\.]/g, '_');
      
      console.log(`Attempting to upload to path: ${sanitizedPath}`);
      
      try {
        // Direct upload without checking bucket existence
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(sanitizedPath, file, { upsert: true });
            
        if (error) {
          console.error("Upload error details:", error);
          continue; // Skip this file but try the others
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(sanitizedPath);
          
        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
          console.log("Upload successful:", urlData.publicUrl);
        }
      } catch (fileError) {
        console.error("Error with file upload:", fileError);
        // Continue with other files even if one fails
      }
    }
    
    return uploadedUrls;
  } catch (error) {
    console.error("General upload error:", error);
    return uploadedUrls; // Return any URLs we managed to get
  }
} 