import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ShopifyProduct, fetchProducts } from '@/lib/shopify';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';

interface RelatedProductsProps {
  title?: string;
  query?: string;
  excludeHandle?: string;
  collectionFilter?: 'direita-raiz' | 'nacao-kids' | 'all';
}

export function RelatedProducts({ title, query, excludeHandle, collectionFilter = 'all' }: RelatedProductsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await fetchProducts(50, query);
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, [query]);

  // Filter by collection
  const collectionFilteredProducts = products.filter(product => {
    const tags = product.node.tags?.map((tag: string) => tag.toUpperCase()) || [];
    const isInfantil = tags.includes('CAMISETA INFANTIL') || tags.includes('BODY INFANTIL');
    
    if (collectionFilter === 'direita-raiz') {
      return !isInfantil;
    } else if (collectionFilter === 'nacao-kids') {
      return isInfantil;
    }
    return true;
  });

  const filteredProducts = excludeHandle 
    ? collectionFilteredProducts.filter(p => p.node.handle !== excludeHandle)
    : collectionFilteredProducts;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.querySelector(':scope > div')?.clientWidth || 200;
    const scrollAmount = cardWidth * 2 + 16; // 2 cards + gap
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        
        {filteredProducts.length > 4 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="h-9 w-9 rounded-full border-emerald-700 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="h-9 w-9 rounded-full border-emerald-700 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {filteredProducts.map((product) => (
          <div
            key={product.node.id}
            className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
