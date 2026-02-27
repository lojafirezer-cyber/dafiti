import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Loader2, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice, fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProductCard } from './ProductCard';

// Discount tiers based on total items
const DISCOUNT_TIERS = [
  { items: 1, discount: 0,  label: '' },
  { items: 2, discount: 10, label: '10% OFF' },
  { items: 3, discount: 20, label: '20% OFF' },
  { items: 4, discount: 30, label: '30% OFF' },
  { items: 5, discount: 40, label: '40% OFF' },
  { items: 6, discount: 50, label: '50% OFF' },
];

function getDiscountPercent(totalItems: number): number {
  const tier = [...DISCOUNT_TIERS].reverse().find(t => totalItems >= t.items);
  return tier?.discount ?? 0;
}

function getNextTier(totalItems: number) {
  return DISCOUNT_TIERS.find(t => t.items > totalItems && t.discount > 0);
}

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
  const [isNavigating, setIsNavigating] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchProducts(8).then(data => {
        setSuggestedProducts(data.slice(0, 6));
      });
    }
  }, [isOpen]);

  const handleCheckout = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setOpen(false);
      navigate('/checkout');
    }, 400);
  };

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const discountPercent = getDiscountPercent(totalItems);
  const nextTier = getNextTier(totalItems);
  const discount = subtotal * (discountPercent / 100);
  const totalPrice = subtotal - discount;

  // Progress bar: from current tier to next tier
  const currentTierItems = DISCOUNT_TIERS.slice().reverse().find(t => totalItems >= t.items)?.items ?? 0;
  const nextTierItems = nextTier?.items ?? 6;
  const progressPercent = nextTier
    ? Math.min(100, ((totalItems - currentTierItems) / (nextTierItems - currentTierItems)) * 100)
    : 100;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-white border-border p-0">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-foreground text-base font-medium">
              <ShoppingBag className="w-5 h-5" />
              Carrinho ({totalItems} {totalItems === 1 ? 'produto' : 'produtos'})
            </SheetTitle>
            <button onClick={() => setOpen(false)} className="hover:bg-muted rounded-full p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
              </div>
            </div>
          ) : (
            <>
              {/* ── Discount Progress Bar ── */}
              <div className="bg-white px-4 pt-3 pb-2 border-b border-gray-100">
                {nextTier ? (
                  <p className="text-xs text-black mb-1.5">
                    Adicione mais <strong>{nextTier.items - totalItems} {nextTier.items - totalItems === 1 ? 'item' : 'itens'}</strong> e ganhe <strong>{nextTier.label}</strong>
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-black mb-1.5">🎉 Você atingiu 50% de desconto!</p>
                )}
                {/* Tier dots */}
                <div className="relative mb-1">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  {/* Tier markers */}
                  <div className="flex justify-between mt-1">
                    {DISCOUNT_TIERS.filter(t => t.discount > 0).map(tier => (
                      <span
                        key={tier.items}
                        className={`text-[9px] font-medium ${totalItems >= tier.items ? 'text-black' : 'text-gray-400'}`}
                      >
                        {tier.label}
                      </span>
                    ))}
                  </div>
                </div>
                {discountPercent > 0 && (
                  <p className="text-xs text-black font-semibold">
                    Desconto aplicado: <span className="text-green-600">{discountPercent}% OFF</span>
                  </p>
                )}
              </div>

              {/* Cart Items */}
              <div className="p-4 space-y-4">
                {items.map(item => {
                  const originalPrice = item.product.node.compareAtPriceRange?.minVariantPrice?.amount;
                  const currentPrice = item.price.amount;
                  const hasDiscount = originalPrice && parseFloat(originalPrice) > parseFloat(currentPrice);
                  return (
                    <div key={item.variantId} className="flex gap-3">
                      <div className="w-20 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-medium text-sm text-foreground line-clamp-2">{item.product.node.title}</h4>
                            <div className="text-right flex-shrink-0">
                              {hasDiscount && (
                                <p className="text-xs text-muted-foreground line-through">
                                  {formatPrice(originalPrice, item.price.currencyCode)}
                                </p>
                              )}
                              <p className="font-semibold text-sm text-foreground">
                                {formatPrice(currentPrice, item.price.currencyCode)}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.selectedOptions.map(o => o.value).join(' / ')}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-md w-fit">
                            <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-1.5 hover:bg-muted transition-colors">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-1.5 hover:bg-muted transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.variantId)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggested Products */}
              {suggestedProducts.length > 0 && (
                <div className="px-4 pb-4">
                  <p className="text-xs font-semibold text-black uppercase tracking-wide mb-3">Adicione mais e ganhe desconto</p>
                  <div className="grid grid-cols-3 gap-2">
                    {suggestedProducts
                      .filter(p => !items.some(i => i.product.node.id === p.node.id))
                      .slice(0, 6)
                      .map(product => (
                        <div
                          key={product.node.id}
                          className="cursor-pointer"
                          onClick={() => { setOpen(false); navigate(`/produto/${product.node.handle}`); }}
                        >
                          <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-1">
                            {product.node.images.edges[0]?.node.url && (
                              <img
                                src={product.node.images.edges[0].node.url}
                                alt={product.node.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <p className="text-[10px] text-black font-medium line-clamp-2 leading-tight">{product.node.title}</p>
                          <p className="text-[10px] text-gray-500">{formatPrice(product.node.priceRange.minVariantPrice.amount, product.node.priceRange.minVariantPrice.currencyCode)}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Summary + Checkout */}
              <div className="flex-shrink-0 border-t border-border bg-white px-4 pt-3 pb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(subtotal.toString())}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Desconto ({discountPercent}%)</span>
                    <span className="text-green-600 font-semibold">-{formatPrice(discount.toString())}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black">Total</span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-black">{formatPrice(totalPrice.toString())}</p>
                    <p className="text-xs text-gray-400">ou 3x de {formatPrice((totalPrice / 3).toString())}</p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full py-6 text-base font-bold bg-green-500 hover:bg-green-600 text-white rounded-lg mt-1"
                  disabled={items.length === 0 || isLoading || isNavigating}
                >
                  {isLoading || isNavigating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isNavigating ? 'Redirecionando...' : 'Processando...'}
                    </>
                  ) : 'Finalizar compra'}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Full screen loading overlay */}
        {isNavigating && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-foreground" />
              <p className="text-sm text-muted-foreground">Preparando checkout...</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
