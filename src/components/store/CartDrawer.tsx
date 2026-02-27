import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Loader2, ShoppingBag, X, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice, fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

// Discount tiers by total quantity
const DISCOUNT_TIERS = [
  { items: 1, discount: 0,  label: '0%' },
  { items: 2, discount: 10, label: '10%' },
  { items: 3, discount: 20, label: '20%' },
  { items: 4, discount: 30, label: '30%' },
  { items: 5, discount: 40, label: '40%' },
  { items: 6, discount: 50, label: '50%' },
];

function getDiscountPercent(totalItems: number): number {
  return [...DISCOUNT_TIERS].reverse().find(t => totalItems >= t.items)?.discount ?? 0;
}
function getNextTier(totalItems: number) {
  return DISCOUNT_TIERS.find(t => t.items > totalItems && t.discount > 0);
}

// Quick-add compact card (horizontal scroll)
function QuickAddCardCompact({
  product,
  onAdded,
}: {
  product: ShopifyProduct;
  onAdded: () => void;
}) {
  const { addItem } = useCartStore();
  const node = product.node;

  const colorOption = node.options.find(o => ['cor', 'color'].includes(o.name.toLowerCase()));
  const sizeOption = node.options.find(o => ['tamanho', 'size'].includes(o.name.toLowerCase()));

  // Pre-select first available color
  const firstAvailableVariant = node.variants.edges.find(v => v.node.availableForSale);
  const firstColorValue = colorOption
    ? firstAvailableVariant?.node.selectedOptions.find(o => ['cor', 'color'].includes(o.name.toLowerCase()))?.value ?? colorOption.values[0]
    : null;

  const [selectedColor, setSelectedColor] = useState<string | null>(firstColorValue);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Image: find variant image matching selected color
  const colorVariant = selectedColor
    ? node.variants.edges.find(v => v.node.selectedOptions.some(o => ['cor', 'color'].includes(o.name.toLowerCase()) && o.value === selectedColor))
    : null;
  const imageUrl = colorVariant?.node.image?.url ?? node.images.edges[0]?.node.url;

  // Available sizes for selected color
  const DEFAULT_SIZES = ['35', '36', '37', '38', '39'];
  const availableSizes = sizeOption
    ? sizeOption.values.filter(size => {
        const variant = node.variants.edges.find(v =>
          v.node.selectedOptions.some(o => ['cor', 'color'].includes(o.name.toLowerCase()) && o.value === selectedColor) &&
          v.node.selectedOptions.some(o => ['tamanho', 'size'].includes(o.name.toLowerCase()) && o.value === size)
        );
        return variant?.node.availableForSale ?? false;
      })
    : DEFAULT_SIZES;

  const handleAdd = () => {
    if (!selectedSize && (sizeOption || availableSizes.length > 0)) return;
    // Try to find matching variant; fall back to first available
    const variant = node.variants.edges.find(v => {
      const opts = v.node.selectedOptions;
      const colorMatch = !selectedColor || opts.some(o => ['cor', 'color'].includes(o.name.toLowerCase()) && o.value === selectedColor);
      const sizeMatch = !selectedSize || opts.some(o => ['tamanho', 'size'].includes(o.name.toLowerCase()) && o.value === selectedSize);
      return colorMatch && sizeMatch && v.node.availableForSale;
    }) ?? node.variants.edges.find(v => v.node.availableForSale);
    if (!variant) return;
    setAdding(true);
    addItem({
      product,
      variantId: variant.node.id,
      variantTitle: variant.node.title,
      price: variant.node.price,
      quantity: 1,
      selectedOptions: variant.node.selectedOptions,
    });
    setTimeout(() => { setAdding(false); onAdded(); }, 300);
  };

  const price = parseFloat(node.priceRange.minVariantPrice.amount);

  return (
    <div className="flex-shrink-0 w-36 flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Image */}
      <div className="w-full aspect-square bg-gray-100 overflow-hidden">
        {imageUrl && <img src={imageUrl} alt={node.title} className="w-full h-full object-cover" />}
      </div>
      {/* Info */}
      <div className="p-2 flex flex-col gap-1.5 flex-1">
        <p className="text-[10px] font-medium text-black line-clamp-2 leading-tight">{node.title}</p>
        <p className="text-[10px] text-gray-400">{formatPrice(price.toString(), node.priceRange.minVariantPrice.currencyCode)}</p>

        {/* Size buttons */}
        {sizeOption && availableSizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {availableSizes.slice(0, 4).map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-1.5 py-0.5 text-[9px] border rounded transition-colors ${
                  selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-600 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={adding || (!selectedSize && availableSizes.length > 0)}
          className={`flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-lg transition-colors mt-auto ${
            adding
              ? 'bg-green-100 text-green-700'
              : !selectedSize && availableSizes.length > 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {adding ? '✓ Ok!' : (!selectedSize && availableSizes.length > 0) ? 'Nº?' : <><Plus className="w-3 h-3" /> Add</>}
        </button>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const navigate = useNavigate();
  const { items, isOpen, isLoading, setOpen, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<ShopifyProduct[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchProducts(12).then(data => setSuggestedProducts(data));
    }
  }, [isOpen]);

  const handleCheckout = () => {
    setIsNavigating(true);
    setTimeout(() => { setOpen(false); navigate('/checkout'); }, 400);
  };

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const discountPercent = getDiscountPercent(totalItems);
  const nextTier = getNextTier(totalItems);
  const discount = subtotal * (discountPercent / 100);
  const totalPrice = subtotal - discount;

  // Progress: 0–100% between current tier and next tier
  const currentTierItems = [...DISCOUNT_TIERS].reverse().find(t => totalItems >= t.items)?.items ?? 1;
  const nextTierItems = nextTier?.items ?? 6;
  const progressPercent = nextTier
    ? Math.min(100, ((totalItems - currentTierItems) / (nextTierItems - currentTierItems)) * 100)
    : 100;

  const suggestedFiltered = suggestedProducts.filter(p => !items.some(i => i.product.node.id === p.node.id));

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-white border-border p-0">
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-black text-sm font-semibold">
              <ShoppingBag className="w-4 h-4" />
              Meu Carrinho · {totalItems} {totalItems === 1 ? 'item' : 'itens'}
            </SheetTitle>
            <button onClick={() => setOpen(false)} className="hover:bg-gray-100 rounded-full p-1 transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Seu carrinho está vazio</p>
                <button onClick={() => setOpen(false)} className="mt-3 text-xs text-black underline">Ver produtos</button>
              </div>
            </div>
          ) : (
            <>
              {/* ── Discount Progress Bar ── */}
              <div className="bg-white px-4 pt-3 pb-3 border-b border-gray-100">
                {/* Labels: current discount + next */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-black">
                    {discountPercent > 0 ? `${discountPercent}% OFF aplicado` : 'Desconto progressivo'}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {nextTier
                      ? `+${nextTier.items - totalItems} item → ${nextTier.label} OFF`
                      : '🎉 Máximo atingido!'}
                  </span>
                </div>

                {/* Loading-style bar */}
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  {/* Animated fill */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progressPercent}%`,
                      background: 'linear-gradient(90deg, #4ade80, #16a34a)',
                    }}
                  >
                    {/* Shimmer sweep inside the fill */}
                    {progressPercent > 0 && progressPercent < 100 && (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.45) 50%, transparent 75%)',
                          animation: 'shimmer-sweep 1.4s ease-in-out infinite',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Tier steps below bar */}
                <div className="flex justify-between mt-1">
                  {DISCOUNT_TIERS.filter(t => t.discount > 0).map(tier => {
                    const reached = totalItems >= tier.items;
                    return (
                      <span
                        key={tier.items}
                        className={`text-[9px] font-semibold transition-colors ${reached ? 'text-green-600' : 'text-gray-300'}`}
                      >
                        {tier.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Cart Items */}
              <div className="px-4 pt-3 pb-1 space-y-3">
                {items.map(item => {
                  const originalPrice = item.product.node.compareAtPriceRange?.minVariantPrice?.amount;
                  const currentPrice = item.price.amount;
                  const hasOriginalDiscount = originalPrice && parseFloat(originalPrice) > parseFloat(currentPrice);
                  return (
                    <div key={item.variantId} className="flex gap-3">
                      <div className="w-18 h-22 w-[68px] h-[84px] bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-medium text-xs text-black line-clamp-2">{item.product.node.title}</h4>
                            <div className="text-right flex-shrink-0">
                              {hasOriginalDiscount && (
                                <p className="text-[10px] text-gray-400 line-through">{formatPrice(originalPrice, item.price.currencyCode)}</p>
                              )}
                              <p className="font-semibold text-xs text-black">{formatPrice(currentPrice, item.price.currencyCode)}</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.selectedOptions.map(o => o.value).join(' · ')}</p>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                            <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-50 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-50 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.variantId)} className="text-[10px] text-gray-400 hover:text-red-500 transition-colors">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggested Products – Quick Add (horizontal scroll) */}
              {suggestedFiltered.length > 0 && (
                <div className="pt-3 pb-2 border-t border-gray-100">
                  <div className="flex items-center justify-between px-4 mb-2">
                    <p className="text-[11px] font-bold text-black uppercase tracking-wider">
                      Adicione mais → mais desconto
                    </p>
                    <button
                      onClick={() => { setOpen(false); navigate('/produtos'); }}
                      className="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-black"
                    >
                      Ver todos <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar scroll-smooth">
                    {suggestedFiltered.slice(0, 8).map(product => (
                      <QuickAddCardCompact
                        key={product.node.id}
                        product={product}
                        onAdded={() => setRefreshKey(k => k + 1)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Summary + Checkout */}
              <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 pt-3 pb-4 space-y-1.5 mt-auto">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal.toString())}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Desconto ({discountPercent}% OFF)</span>
                    <span className="text-green-600 font-semibold">-{formatPrice(discount.toString())}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-black text-sm">Total</span>
                  <div className="text-right">
                    <p className="text-base font-bold text-black">{formatPrice(totalPrice.toString())}</p>
                    <p className="text-[10px] text-gray-400">ou 3x de {formatPrice((totalPrice / 3).toString())}</p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full py-5 text-sm font-bold bg-green-500 hover:bg-green-600 text-white rounded-lg mt-2"
                  disabled={items.length === 0 || isLoading || isNavigating}
                >
                  {isLoading || isNavigating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isNavigating ? 'Redirecionando...' : 'Processando...'}</>
                  ) : 'Finalizar compra'}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Navigation overlay */}
        {isNavigating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-black" />
              <p className="text-sm text-gray-500">Preparando checkout...</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
