-- Create storage bucket for document images
INSERT INTO storage.buckets (id, name, public)
VALUES ('document-images', 'document-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload document images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'document-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own images
CREATE POLICY "Users can view their own document images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'document-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read for document images (since bucket is public)
CREATE POLICY "Public can view document images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'document-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own document images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'document-images' AND auth.uid()::text = (storage.foldername(name))[1]);