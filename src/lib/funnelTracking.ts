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
  event_type: string;
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
    const { event_type, product_id, product_title, variant_id, price, quantity, order_id, order_total, metadata } = params;
    await (supabase.from('funnel_events') as any).insert({
      visitor_id: getVisitorId(),
      event_type,
      product_id,
      product_title,
      variant_id,
      price,
      quantity,
      order_id,
      order_total,
      metadata,
    });
  } catch (e) {
    // Silent fail for tracking
  }
}
