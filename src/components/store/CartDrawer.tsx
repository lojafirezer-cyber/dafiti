import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Loader2, ShoppingBag, ArrowRight, Truck, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import dafiti from '@/assets/dafiti-logo.png';

export function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    isLoading,
    setOpen,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems
  } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [cepCode, setCepCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [shippingInfo, setShippingInfo] = useState<{
    city: string;
    state: string;
    deliveryDateStart: string;
    deliveryDateEnd: string;
  } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleCheckout = () => {
    setIsNavigating(true);
    // Small delay for visual feedback before navigation
    setTimeout(() => {
      setOpen(false);
      navigate('/checkout');
    }, 400);
  };
  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();

    // RAIZ10: 10% de desconto, mínimo 2 itens
    if (code === 'RAIZ10') {
      if (totalItems >= 2) {
        setAppliedCoupon('RAIZ10');
        setCouponCode('');
      } else {
        setCouponError('Mínimo de 2 itens para usar este cupom');
      }
    } else if (code !== '') {
      setCouponError('Cupom inválido');
    }
  };
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCepCode(formatted);
    setCepError('');
    if (formatted.length < 9) {
      setShippingInfo(null);
    }
  };
  const calculateDeliveryDates = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 9);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 12);
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short'
      });
    };
    return {
      start: formatDate(startDate),
      end: formatDate(endDate)
    };
  };
  const fetchCepInfo = async () => {
    const cleanCep = cepCode.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setCepError('CEP inválido');
      return;
    }
    setLoadingCep(true);
    setCepError('');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (data.erro) {
        setCepError('CEP não encontrado');
        setShippingInfo(null);
      } else {
        const dates = calculateDeliveryDates();
        setShippingInfo({
          city: data.localidade,
          state: data.uf,
          deliveryDateStart: dates.start,
          deliveryDateEnd: dates.end
        });
      }
    } catch (error) {
      setCepError('Erro ao buscar CEP');
      setShippingInfo(null);
    } finally {
      setLoadingCep(false);
    }
  };
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();

  // Regra: 2+ itens = frete grátis
  const hasFreeShipping = totalItems >= 2;
  const itemsForFreeShipping = 2;
  const itemsRemaining = Math.max(0, itemsForFreeShipping - totalItems);
  const progressPercent = Math.min(100, totalItems / itemsForFreeShipping * 100);

  // Valor do frete (R$ 19,59 conforme imagem, grátis com 2+ itens)
  const shippingCost = hasFreeShipping ? 0 : 19.59;

  // Desconto do cupom RAIZ10 (10%)
  const discount = appliedCoupon === 'RAIZ10' ? subtotal * 0.10 : 0;
  const totalPrice = subtotal - discount + shippingCost;
  return <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-border p-0">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <img src={dafiti} alt="Dafiti" className="h-7 w-auto" />
            <SheetTitle className="flex items-center gap-2 text-foreground text-sm font-medium">
              <ShoppingBag className="w-4 h-4" />
              Minha sacola ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
            </SheetTitle>
            <button onClick={() => setOpen(false)} className="hover:bg-muted rounded-full p-1.5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
              </div>
            </div> : <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map(item => {
              const originalPrice = item.product.node.compareAtPriceRange?.minVariantPrice?.amount;
              const currentPrice = item.price.amount;
              const hasDiscount = originalPrice && parseFloat(originalPrice) > parseFloat(currentPrice);
              return <div key={item.variantId} className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-28 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-medium text-sm text-foreground line-clamp-2">
                              {item.product.node.title}
                            </h4>
                            <div className="text-right flex-shrink-0">
                              {hasDiscount && <p className="text-xs text-muted-foreground line-through">
                                  {formatPrice(originalPrice, item.price.currencyCode)}
                                </p>}
                              <p className="font-semibold text-sm text-foreground">
                                {formatPrice(currentPrice, item.price.currencyCode)}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.selectedOptions.map(o => o.value).join(' / ')}
                          </p>
                        </div>
                        
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-border rounded-md w-fit mt-2">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-2 hover:bg-muted transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-2 hover:bg-muted transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>;
            })}
              </div>

              {/* Footer Section */}
              <div className="flex-shrink-0 border-t border-border bg-background">
                {/* Barra de Progresso Frete Grátis - só mostra se ainda não atingiu */}
                {!hasFreeShipping && <div className="px-4 py-3">
                    <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                      <div style={{
                  width: `${progressPercent}%`
                }} className="absolute left-0 top-0 h-full transition-all duration-500 bg-emerald-700" />
                    </div>
                    <p className="text-center text-sm mt-2 text-foreground">
                      Faltam {itemsRemaining} {itemsRemaining === 1 ? 'item' : 'itens'} para o frete grátis.
                    </p>
                  </div>}

                {/* Cupom */}
                <div className="flex flex-col px-4 py-3 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Cupom</span>
                    {appliedCoupon ? <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          {appliedCoupon} aplicado
                        </span>
                        <button onClick={handleRemoveCoupon} className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div> : <div className="flex items-center gap-2">
                        <Input type="text" placeholder="CUPOM" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} className="w-32 h-7 text-center text-xs border-border rounded-full" />
                        <button onClick={handleApplyCoupon} className="p-2 hover:bg-muted rounded-full transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>}
                  </div>
                  {couponError && <p className="text-xs text-destructive text-right">{couponError}</p>}
                </div>

                {/* Frete */}
                <div className="flex flex-col px-4 py-3 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Frete</span>
                    <div className="flex items-center gap-2">
                      <Input type="text" placeholder="00000-000" value={cepCode} onChange={handleCepChange} maxLength={9} className="w-32 h-7 text-center text-xs border-border rounded-full" />
                      <button onClick={fetchCepInfo} disabled={loadingCep} className="p-2 hover:bg-muted rounded-full transition-colors">
                        {loadingCep ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {cepError && <p className="text-xs text-destructive text-right">{cepError}</p>}
                  {shippingInfo && <div className="flex items-center justify-between text-xs bg-muted/50 rounded-md px-3 py-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>
                          Até {shippingInfo.deliveryDateEnd}. <span className="underline cursor-pointer">{cepCode}</span>
                        </span>
                      </div>
                      <span className={`font-semibold ${hasFreeShipping ? 'text-emerald-600' : 'text-foreground'}`}>
                        {formatPrice(shippingCost.toString())}
                      </span>
                    </div>}
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-foreground">Subtotal</span>
                  <span className="text-sm text-foreground">{formatPrice(subtotal.toString())}</span>
                </div>

                {/* Desconto */}
                {discount > 0 && <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-foreground">Desconto</span>
                    <span className="text-sm text-emerald-600">-{formatPrice(discount.toString())}</span>
                  </div>}

                {/* Total */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{formatPrice(totalPrice.toString())}</p>
                    <p className="text-xs text-muted-foreground">
                      ou 3x de {formatPrice((totalPrice / 3).toString())}
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="p-4">
                  <Button onClick={handleCheckout} className="w-full bg-black text-white hover:bg-black/90 py-6 text-base font-medium rounded-lg" disabled={items.length === 0 || isLoading || isNavigating}>
                    {isLoading || isNavigating ? <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isNavigating ? 'Redirecionando...' : 'Processando...'}
                      </> : 'Finalizar compra'}
                  </Button>
                </div>
              </div>
            </>}
        </div>
        
        {/* Full screen loading overlay during navigation */}
        {isNavigating && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-foreground" />
              <p className="text-sm text-muted-foreground">Preparando checkout...</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>;
}