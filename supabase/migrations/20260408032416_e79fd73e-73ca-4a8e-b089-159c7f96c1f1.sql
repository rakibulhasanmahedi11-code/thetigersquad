
-- Create logos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

-- Allow public read
CREATE POLICY "Anyone can view logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');

-- Allow authenticated upload
CREATE POLICY "Authenticated can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

-- Allow authenticated update
CREATE POLICY "Authenticated can update logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');

-- Allow authenticated delete
CREATE POLICY "Authenticated can delete logos" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
