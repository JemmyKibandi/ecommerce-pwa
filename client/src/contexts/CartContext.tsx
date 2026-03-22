import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import api from '@/lib/axios';
import type { Cart, CartItem } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextValue {
  cart: Cart;
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetchCart: () => Promise<void>;
}

const EMPTY_CART: Cart = { items: [] };

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(EMPTY_CART);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart ?? EMPTY_CART);
    } catch {
      setCart(EMPTY_CART);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity: number) => {
    const { data } = await api.post('/cart', { productId, quantity });
    setCart(data.cart);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const { data } = await api.post('/cart', { productId, quantity });
    setCart(data.cart);
  };

  const removeFromCart = async (productId: string) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data.cart);
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart(EMPTY_CART);
  };

  const itemCount = cart.items.reduce((sum, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce(
    (sum, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalPrice,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refetchCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
