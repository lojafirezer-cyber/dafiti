import { useEffect, useState } from 'react';
import { trackFunnelEvent } from '@/lib/funnelTracking';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/store/Logo';
import { formatPrice } from '@/lib/shopify';

interface OrderData {
  items: Array<{
    title: string;
    quantity: number;
    price: string;
    image?: string;
    variant?: string;
  }>;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  coupon: string | null;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  paymentMethod: string;
  orderId: string;
  deliveryEstimate: {
    dateStart: string;
    dateEnd: string;
  } | null;
}

export default function ThankYou() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lastOrder');
    if (stored) {
      const orderData = JSON.parse(stored) as OrderData;
      setOrder(orderData);
      localStorage.removeItem('lastOrder');

      // Fire TikTok Purchase pixel event
      if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('PlaceAnOrder', {
          value: orderData.total,
          currency: 'BRL',
          order_id: orderData.orderId,
          contents: orderData.items.map((item: any) => ({
            content_id: item.variantId || item.title,
            content_name: item.title,
            quantity: item.quantity,
            price: parseFloat(item.price),
          })),
        });
        console.log('[TikTok Pixel] Purchase event fired:', orderData.orderId, orderData.total);
      }

      // Fire Twitter/X conversion pixel
      if (typeof window !== 'undefined' && (window as any).twq) {
        (window as any).twq('event', 'tw-r4hhy-r4hhz', {
          value: orderData.total,
          currency: 'BRL',
          num_items: orderData.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
          conversion_id: orderData.orderId,
          description: 'Compra finalizada',
        });
        console.log('[Twitter Pixel] Purchase event fired:', orderData.orderId, orderData.total);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] md:origin-top md:scale-110" style={{ overflowX: 'clip' }}>
      {/* Header */}
      <header className="bg-black py-4 px-4 border-b border-neutral-800">
        <div className="container max-w-6xl mx-auto flex items-center justify-center">
          <Link to="/">
            <Logo className="h-8 md:h-10 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-2xl mx-auto px-4 space-y-6 animate-fade-in">
          {/* Success Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#36B376]/10 mb-2">
              <CheckCircle className="w-9 h-9 text-[#36B376]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Pedido Confirmado!
            </h1>
            <p className="text-sm text-muted-foreground">
              Obrigado pela sua compra. Seu pedido <span className="font-semibold text-foreground">{order.orderId}</span> foi recebido com sucesso.
            </p>
            <p className="text-xs text-muted-foreground">
              Enviamos um e-mail de confirmação para <span className="font-medium text-foreground">{order.customer.email}</span>
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Itens do Pedido
            </h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  {item.image && (
                    <div className="w-14 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground">{item.variant}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold flex-shrink-0">
                    {formatPrice((parseFloat(item.price) * item.quantity).toString())}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal.toString())}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#36B376]">
                  <span>Desconto {order.coupon && `(${order.coupon})`}</span>
                  <span>-{formatPrice(order.discount.toString())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className={order.shippingCost === 0 ? 'text-[#36B376] font-medium' : ''}>
                  {order.shippingCost === 0 ? 'Grátis' : formatPrice(order.shippingCost.toString())}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(order.total.toString())}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço de Entrega
            </h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{order.customer.name}</p>
              <p>
                {order.shipping.street}, {order.shipping.number}
                {order.shipping.complement && ` - ${order.shipping.complement}`}
              </p>
              <p>{order.shipping.neighborhood}</p>
              <p>{order.shipping.city}, {order.shipping.state} - CEP {order.shipping.cep}</p>
            </div>
            {order.deliveryEstimate && (
              <div className="mt-3 pt-3 border-t border-border text-sm">
                <span className="text-muted-foreground">Previsão de entrega: </span>
                <span className="font-medium text-foreground">
                  {order.deliveryEstimate.dateStart} – {order.deliveryEstimate.dateEnd}
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center space-y-3 pt-2">
            <Button asChild className="w-full py-5 bg-foreground hover:bg-foreground/90 text-background font-bold gap-2">
              <Link to="/">
                Continuar comprando
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full py-5">
              <Link to="/rastreio">
                Rastrear meu pedido
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
