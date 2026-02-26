import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ShopifyProduct, fetchProducts } from '@/lib/shopify';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';

const PRODUCTS_PER_PAGE = 24;

interface HomeProductGridProps {
  collectionFilter?: 'nacao-raiz' | 'nacao-kids';
  sectionTitle?: string;
}

export function HomeProductGrid({ collectionFilter = 'nacao-raiz', sectionTitle }: HomeProductGridProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await fetchProducts(100);
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Reset page when collection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [collectionFilter]);

  // Filter by collection
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const tags = product.node.tags?.map((tag: string) => tag.toUpperCase()) || [];
      const isInfantil = tags.includes('CAMISETA INFANTIL') || tags.includes('BODY INFANTIL');
      
      if (collectionFilter === 'nacao-kids') return isInfantil;
      return !isInfantil; // nacao-raiz = adult products
    });
  }, [products, collectionFilter]);

  // Sort products: Camiseta first, then Camiseta Infantil, then Body Infantil
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const tagsA = a.node.tags?.map((tag: string) => tag.toUpperCase()) || [];
      const tagsB = b.node.tags?.map((tag: string) => tag.toUpperCase()) || [];
      
      const getPriority = (tags: string[]) => {
        if (tags.includes('BODY INFANTIL')) return 3;
        if (tags.includes('CAMISETA INFANTIL')) return 2;
        return 1;
      };
      
      return getPriority(tagsA) - getPriority(tagsB);
    });
  }, [filteredProducts]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-muted-foreground mb-4">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <section id="collection-grid" className="py-8 px-4 md:px-10 lg:px-20">
      {sectionTitle && (
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">{sectionTitle}</h2>
      )}
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.node.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCurrentPage(p => Math.max(1, p - 1));
              document.getElementById('collection-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  document.getElementById('collection-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`h-8 w-8 text-sm font-medium rounded transition-colors ${
                  currentPage === page
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCurrentPage(p => Math.min(totalPages, p + 1));
              document.getElementById('collection-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
