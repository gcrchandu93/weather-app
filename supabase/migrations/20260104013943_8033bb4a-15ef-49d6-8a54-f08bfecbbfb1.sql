-- Create search_history table for storing recent city searches
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_name TEXT NOT NULL,
  search_query TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries on searched_at
CREATE INDEX idx_search_history_searched_at ON public.search_history (searched_at DESC);

-- Enable RLS but allow public access since this is a public weather app
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read search history
CREATE POLICY "Anyone can view search history" 
ON public.search_history 
FOR SELECT 
USING (true);

-- Allow anyone to insert search history
CREATE POLICY "Anyone can insert search history" 
ON public.search_history 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to delete search history
CREATE POLICY "Anyone can delete search history" 
ON public.search_history 
FOR DELETE 
USING (true);