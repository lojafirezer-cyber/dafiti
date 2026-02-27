import { supabase } from '@/integrations/supabase/client';

function getVisitorId(): string {
  let id = localStorage.getItem('shopify_visitor_id');
  if (!id) {
    id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem('shopify_visitor_id', id);
  }
  return id;
}

export async function trackFunnelEvent(params: {
  event_type: 'product_view' | 'add_to_cart' | 'checkout_started' | 'purchase';
  product_id?: string;
  product_title?: string;
  variant_id?: string;
  price?: number;
  quantity?: number;
  order_id?: string;
  order_total?: number;
  metadata?: Record<string, unknown>;
}) {
  try {
    await supabase.from('funnel_events').insert({
      visitor_id: getVisitorId(),
      ...params,
    });
  } catch (e) {
    // Silent fail for tracking
  }
}
