-- Create storage bucket for AI era images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('era-images', 'era-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Era images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'era-images');

-- Allow authenticated and anon users to upload (for edge function)
CREATE POLICY "Anyone can upload era images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'era-images');

-- Allow updates
CREATE POLICY "Anyone can update era images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'era-images');