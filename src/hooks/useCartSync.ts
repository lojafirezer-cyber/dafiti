import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { storefrontApiRequest } from '@/lib/shopify';

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) {
      id
      totalQuantity
    }
  }
`;

export function useCartSync() {
  const cartId = useCartStore(state => state.cartId);
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    const syncCart = async () => {
      if (!cartId) return;

      try {
        const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
        if (!data) return;
        
        const cart = data?.data?.cart;
        // Se o carrinho não existe mais ou está vazio, limpar o estado local
        if (!cart || cart.totalQuantity === 0) {
          clearCart();
        }
      } catch (error) {
        console.error('Failed to sync cart with Shopify:', error);
      }
    };

    // Sincroniza na carga inicial
    syncCart();

    // Sincroniza quando o usuário volta para a aba
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncCart();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cartId, clearCart]);
}
