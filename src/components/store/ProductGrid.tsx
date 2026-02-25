import { useEffect, useState } from 'react';
import { ChevronDown, Grid2X2, Grid3X3, Loader2 } from 'lucide-react';
import { ShopifyProduct, fetchProducts } from '@/lib/shopify';
import { ProductCard } from './ProductCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const sortOptions = [
  { label: 'Mais vendidas', value: 'sales' },
  { label: 'Menor preço', value: 'lowest_price' },
  { label: 'Maior preço', value: 'biggest_price' },
  { label: 'Promoções', value: 'promotions' },
  { label: 'Novidades', value: 'recent' },
];

interface ProductGridProps {
  title?: string;
  query?: string;
  excludeHandle?: string;
  collectionFilter?: 'direita-raiz' | 'nacao-kids' | 'all';
}

export function ProductGrid({ title, query, excludeHandle, collectionFilter = 'all' }: ProductGridProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridCols, setGridCols] = useState(4);
  const [sortBy, setSortBy] = useState('sales');

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

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'lowest_price':
        return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
      case 'biggest_price':
        return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl text-muted-foreground mb-4">Nenhum produto encontrado</p>
        <p className="text-sm text-muted-foreground">
          Adicione produtos através do chat para começar a vender.
        </p>
      </div>
    );
  }

  return (
    <section className="py-8 px-4 md:px-10 lg:px-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-primary rounded-full hover:bg-secondary transition-colors">
              Ordenar por
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background border-border">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? 'bg-primary text-primary-foreground' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setGridCols(2)}
            className={`p-2 rounded ${gridCols === 2 ? 'text-primary' : 'text-muted-foreground'}`}
            aria-label="2 colunas"
          >
            <Grid2X2 className="w-6 h-6" />
          </button>
          <button
            onClick={() => setGridCols(4)}
            className={`p-2 rounded ${gridCols === 4 ? 'text-primary' : 'text-muted-foreground'}`}
            aria-label="4 colunas"
          >
            <Grid3X3 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div 
        className={`grid gap-4 md:gap-6 ${
          gridCols === 2 
            ? 'grid-cols-2' 
            : 'grid-cols-2 md:grid-cols-4'
        }`}
      >
        {sortedProducts.map((product) => (
          <ProductCard key={product.node.id} product={product} />
        ))}
      </div>
    </section>
  );
}
