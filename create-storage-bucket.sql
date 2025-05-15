-- Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the storage.objects table if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow any user (including anonymous) to read files
CREATE POLICY "Public READ access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow any user (including anonymous) to upload files for testing purposes
-- In production, you should restrict this to authenticated users only
CREATE POLICY "Public UPLOAD access" ON storage.objects
  FOR INSERT
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Allow any user (including anonymous) to update their own uploaded files
CREATE POLICY "Public UPDATE access" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Allow any user (including anonymous) to delete their own uploaded files
CREATE POLICY "Public DELETE access" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'product-images'); 