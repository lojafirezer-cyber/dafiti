import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShopifyProduct, formatPrice, calculateDiscount, calculateInstallments } from '@/lib/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

// Map common color names to CSS colors
const COLOR_MAP: Record<string, string> = {
  preto: '#1a1a1a', black: '#1a1a1a',
  branco: '#ffffff', white: '#ffffff',
  vermelho: '#e53e3e', red: '#e53e3e',
  azul: '#3182ce', blue: '#3182ce',
  verde: '#38a169', green: '#38a169',
  amarelo: '#ecc94b', yellow: '#ecc94b',
  cinza: '#718096', gray: '#718096', grey: '#718096',
  rosa: '#ed64a6', pink: '#ed64a6',
  laranja: '#ed8936', orange: '#ed8936',
  roxo: '#805ad5', purple: '#805ad5',
  marrom: '#744210', brown: '#744210',
  bege: '#e8d5b0', beige: '#e8d5b0',
  'off-white': '#f5f0e8', offwhite: '#f5f0e8',
  navy: '#1a365d', 'azul marinho': '#1a365d',
  caramelo: '#b7791f', camel: '#b7791f',
  khaki: '#9b8e6e',
};

function getColorCss(colorName: string): string {
  const key = colorName.toLowerCase().trim();
  return COLOR_MAP[key] || '#cccccc';
}

export function ProductCard({ product }: ProductCardProps) {
  const { node } = product;

  // Get color option
  const colorOption = node.options.find(
    (o) => o.name.toLowerCase() === 'cor' || o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour'
  );
  const colors = colorOption?.values ?? [];

  // Pre-select first color
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? '');

  // Find variant matching selected color
  const getVariantForColor = useCallback((color: string) => {
    if (!color) return node.variants.edges[0]?.node;
    return node.variants.edges.find(({ node: v }) =>
      v.selectedOptions.some(
        (o) => (o.name.toLowerCase() === 'cor' || o.name.toLowerCase() === 'color') && o.value === color
      )
    )?.node ?? node.variants.edges[0]?.node;
  }, [node.variants.edges]);

  const activeVariant = getVariantForColor(selectedColor);

  // Image: prefer variant image, fallback to product images
  const activeImageUrl = activeVariant?.image?.url || node.images.edges[0]?.node.url;
  const activeImageAlt = activeVariant?.image?.altText || node.title;

  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAtPrice = activeVariant?.compareAtPrice
    ? parseFloat(activeVariant.compareAtPrice.amount)
    : null;
  const discount = compareAtPrice ? calculateDiscount(compareAtPrice.toString(), price.toString()) : 0;
  const currencyCode = node.priceRange.minVariantPrice.currencyCode;

  return (
    <div className="product-card group">
      <Link to={`/produto/${node.handle}${selectedColor ? `?color=${encodeURIComponent(selectedColor)}` : ''}`} className="block">
        <div className="product-card-image">
          {activeImageUrl ? (
            <img
              src={activeImageUrl}
              alt={activeImageAlt}
              loading="lazy"
              className="transition-opacity duration-200"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              Sem imagem
            </div>
          )}

          {discount > 0 && (
            <span className="product-card-badge">-{discount}%</span>
          )}
        </div>
      </Link>

      <div className="product-card-info">
        <Link to={`/produto/${node.handle}`}>
          <h3 className="product-card-title">{node.title}</h3>
        </Link>

        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {colors.map((color) => {
              const css = getColorCss(color);
              const isSelected = selectedColor === color;
              const isWhiteish = css === '#ffffff' || css === '#f5f0e8' || css === '#e8d5b0';
              return (
                <button
                  key={color}
                  title={color}
                  onClick={(e) => { e.preventDefault(); setSelectedColor(color); }}
                  className={`w-5 h-5 rounded-full transition-all flex-shrink-0 ${
                    isSelected ? 'ring-2 ring-offset-1 ring-foreground scale-110' : 'ring-1 ring-border hover:scale-105'
                  } ${isWhiteish ? 'border border-border' : ''}`}
                  style={{ backgroundColor: css }}
                  aria-label={`Cor: ${color}`}
                />
              );
            })}
          </div>
        )}

        {colors.length > 0 && (
          <p className="text-[10px] text-muted-foreground mt-1">{selectedColor}</p>
        )}

        <div className="product-card-prices mt-1">
          {compareAtPrice && discount > 0 && (
            <span className="product-card-original-price">
              {formatPrice(compareAtPrice.toString(), currencyCode)}
            </span>
          )}
          <span className="product-card-price">
            {compareAtPrice && discount > 0 ? '| ' : ''}
            {formatPrice(price.toString(), currencyCode)}
          </span>
        </div>

        <p className="product-card-installments">
          3x de {calculateInstallments(price.toString())} sem juros
        </p>
      </div>
    </div>
  );
}
