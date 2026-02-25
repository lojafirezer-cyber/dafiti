import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const SHOPIFY_STORE_DOMAIN = 'cbzktq-8n.myshopify.com';

// Shopify Web Pixel tracking for Live View
export const ShopifyAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Shopify analytics
    initShopifyAnalytics();
  }, []);

  useEffect(() => {
    // Track page views on route change
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};

function initShopifyAnalytics() {
  // Create unique visitor ID if not exists
  let visitorId = localStorage.getItem('shopify_visitor_id');
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem('shopify_visitor_id', visitorId);
  }

  // Send initial session start
  sendAnalyticsEvent('session_start', {
    visitor_id: visitorId,
    timestamp: new Date().toISOString(),
    referrer: document.referrer,
    user_agent: navigator.userAgent,
  });

  // Track when user leaves
  window.addEventListener('beforeunload', () => {
    sendAnalyticsEvent('session_end', {
      visitor_id: visitorId,
      timestamp: new Date().toISOString(),
    });
  });

  console.log('[Shopify Analytics] Initialized with visitor ID:', visitorId);
}

function trackPageView(path: string) {
  const visitorId = localStorage.getItem('shopify_visitor_id');
  
  // Save to database for admin analytics
  supabase.from('page_views').insert({
    page_path: path,
    page_title: document.title,
    visitor_id: visitorId || 'unknown',
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
  }).then(() => {});

  sendAnalyticsEvent('page_view', {
    visitor_id: visitorId,
    page_path: path,
    page_title: document.title,
    timestamp: new Date().toISOString(),
  });
}

// Track product views
export function trackProductView(productId: string, productTitle: string, price: string) {
  const visitorId = localStorage.getItem('shopify_visitor_id');
  
  sendAnalyticsEvent('product_viewed', {
    visitor_id: visitorId,
    product_id: productId,
    product_title: productTitle,
    price: price,
    timestamp: new Date().toISOString(),
  });

  console.log('[Shopify Analytics] Product view tracked:', productTitle);
}

// Track add to cart
export function trackAddToCart(productId: string, variantId: string, quantity: number, price: string) {
  const visitorId = localStorage.getItem('shopify_visitor_id');
  
  sendAnalyticsEvent('product_added_to_cart', {
    visitor_id: visitorId,
    product_id: productId,
    variant_id: variantId,
    quantity: quantity,
    price: price,
    timestamp: new Date().toISOString(),
  });

  console.log('[Shopify Analytics] Add to cart tracked');
}

// Track checkout started
export function trackCheckoutStarted(totalValue: string, itemCount: number) {
  const visitorId = localStorage.getItem('shopify_visitor_id');
  
  sendAnalyticsEvent('checkout_started', {
    visitor_id: visitorId,
    total_value: totalValue,
    item_count: itemCount,
    timestamp: new Date().toISOString(),
  });

  console.log('[Shopify Analytics] Checkout started tracked');
}

function sendAnalyticsEvent(eventName: string, data: Record<string, unknown>) {
  // Use Shopify's analytics endpoint
  const payload = {
    event: eventName,
    shop: SHOPIFY_STORE_DOMAIN,
    ...data,
  };

  // Use sendBeacon for reliable delivery even on page unload
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(`https://${SHOPIFY_STORE_DOMAIN}/wpm@*`, blob);
  }

  // Also try standard fetch for immediate events
  fetch(`https://${SHOPIFY_STORE_DOMAIN}/wpm@*`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    mode: 'no-cors', // Shopify endpoint may not support CORS
    keepalive: true,
  }).catch(() => {
    // Silent fail for analytics
  });
}

function generateVisitorId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default ShopifyAnalytics;
