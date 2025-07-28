-- Create storage bucket for pet images
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-images', 'pet-images', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload pet images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pet-images' AND auth.role() = 'authenticated');

-- Create policy to allow anyone to view pet images
CREATE POLICY "Anyone can view pet images" ON storage.objects
  FOR SELECT USING (bucket_id = 'pet-images');

-- Create policy to allow users to update their own images
CREATE POLICY "Users can update their own pet images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to delete their own images
CREATE POLICY "Users can delete their own pet images" ON storage.objects
  FOR DELETE USING (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);
