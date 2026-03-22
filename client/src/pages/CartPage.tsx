import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';
import { PageSpinner } from '@/components/ui/Spinner';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateQty = async (productId: string, qty: number) => {
    setUpdatingId(productId);
    try {
      await updateQuantity(productId, qty);
    } catch {
      error('Failed to update quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: string, name: string) => {
    setUpdatingId(productId);
    try {
      await removeFromCart(productId);
      success(`${name} removed from cart`);
    } catch {
      error('Failed to remove item');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) return <PageSpinner />;

  const isEmpty = cart.items.length === 0;

  return (
    <div className="container-custom py-10">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-title mb-10"
      >
        Shopping Cart
        {!isEmpty && (
          <span className="ml-3 text-lg font-normal text-stone-400">
            ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
          </span>
        )}
      </motion.h1>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <ShoppingBag size={48} className="text-stone-200 mb-6" />
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Your cart is empty</h2>
          <p className="text-stone-400 mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn-primary">
            Start shopping
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0">
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-3 border-b border-stone-100 text-xs uppercase tracking-widest text-stone-400 font-medium">
              <span>Product</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Price</span>
              <span></span>
            </div>

            <AnimatePresence>
              {cart.items.map((item: CartItem) => {
                const pid = item.product._id;
                const isUpdating = updatingId === pid;
                const imageUrl = item.product.images[0] ?? `https://picsum.photos/seed/${pid}/200/200`;

                return (
                  <motion.div
                    key={pid}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center py-6 border-b border-stone-50 ${
                      isUpdating ? 'opacity-60 pointer-events-none' : ''
                    }`}
                  >
                    {/* Product info */}
                    <div className="flex items-center gap-4">
                      <Link to={`/products/${pid}`} className="shrink-0">
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover bg-stone-100 rounded-lg"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/products/${pid}`}
                          className="font-medium text-stone-950 hover:text-stone-600 transition-colors text-sm"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-stone-400 mt-1">{item.product.category}</p>
                        <p className="text-sm font-semibold text-stone-900 mt-1 sm:hidden">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center border border-stone-200 w-fit rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleUpdateQty(pid, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-50 disabled:opacity-30"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(pid, item.quantity + 1)}
                        disabled={item.quantity >= (item.product.stock ?? 99)}
                        className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-50 disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="hidden sm:block text-sm font-semibold text-stone-950 text-right">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(pid, item.product.name)}
                      className="p-1.5 text-stone-300 hover:text-red-500 transition-colors justify-self-end"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="pt-6">
              <Link to="/products" className="text-sm text-stone-500 hover:text-stone-950 transition-colors flex items-center gap-1.5">
                ← Continue shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-stone-50 border border-stone-100 p-6 h-fit space-y-4 rounded-2xl"
          >
            <h2 className="text-lg font-semibold text-stone-950">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span>{totalPrice >= 10000 ? 'Free' : formatPrice(350)}</span>
              </div>
              {totalPrice < 10000 && (
                <p className="text-xs text-stone-400">
                  Add {formatPrice(10000 - totalPrice)} more for free delivery
                </p>
              )}
            </div>
            <div className="border-t border-stone-200 pt-4 flex justify-between font-semibold text-stone-950">
              <span>Total</span>
              <span>
                {formatPrice(totalPrice >= 10000 ? totalPrice : totalPrice + 350)}
              </span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-4 text-sm justify-center"
            >
              Checkout <ArrowRight size={15} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
