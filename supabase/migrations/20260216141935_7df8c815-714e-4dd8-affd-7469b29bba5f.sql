
-- Table to track page views for analytics
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_title TEXT,
  visitor_id TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Anyone can insert page views"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

-- No direct SELECT from frontend (only via edge function with admin password)
CREATE POLICY "No direct select"
  ON public.page_views FOR SELECT
  USING (false);

-- Index for faster analytics queries
CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_visitor_id ON public.page_views (visitor_id);
CREATE INDEX idx_page_views_page_path ON public.page_views (page_path);
