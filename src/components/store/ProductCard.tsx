import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ShopifyProduct, formatPrice, calculateDiscount, calculateInstallments } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, setOpen } = useCartStore();
  const { node } = product;
  const firstVariant = node.variants.edges[0]?.node;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAtPrice = firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : null;
  const discount = compareAtPrice ? calculateDiscount(compareAtPrice.toString(), price.toString()) : 0;
  const imageUrl = node.images.edges[0]?.node.url;
  const currencyCode = node.priceRange.minVariantPrice.currencyCode;

  return (
    <Link to={`/produto/${node.handle}`} className="product-card group">
      <div className="product-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={node.images.edges[0]?.node.altText || node.title} loading="lazy" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            Sem imagem
          </div>
        )}

        {discount > 0 && (
          <span className="product-card-badge">
            -{discount}%
          </span>
        )}
      </div>

      <div className="product-card-info">
        <h3 className="product-card-title">{node.title}</h3>

        <div className="product-card-prices">
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
    </Link>
  );
}
