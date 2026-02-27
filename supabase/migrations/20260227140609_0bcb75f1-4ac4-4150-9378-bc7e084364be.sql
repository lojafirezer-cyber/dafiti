
CREATE TABLE public.funnel_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  product_id TEXT,
  product_title TEXT,
  variant_id TEXT,
  price NUMERIC,
  quantity INTEGER,
  order_id TEXT,
  order_total NUMERIC,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert funnel events" ON public.funnel_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read funnel events" ON public.funnel_events FOR SELECT USING (true);

CREATE INDEX idx_funnel_events_type ON public.funnel_events(event_type);
CREATE INDEX idx_funnel_events_created_at ON public.funnel_events(created_at DESC);
CREATE INDEX idx_funnel_events_visitor ON public.funnel_events(visitor_id);
