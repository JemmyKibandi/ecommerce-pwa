import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      info('Please sign in to add items to your cart');
      return;
    }

    if (product.stock === 0) {
      error('This product is out of stock');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product._id, 1);
      success(`${product.name} added to cart`);
    } catch {
      error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const imageUrl = product.images[0] ?? `https://picsum.photos/seed/${product._id}/600/600`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group"
    >
      <Link to={`/products/${product._id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-stone-100 aspect-square mb-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-600">
                Out of stock
              </span>
            </div>
          )}
          {/* Quick add button */}
          <motion.button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="absolute bottom-0 left-0 right-0 bg-stone-950 text-stone-50 text-xs font-medium uppercase tracking-widest py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 disabled:opacity-60"
          >
            {adding ? (
              <Spinner size="sm" className="border-stone-700 border-t-stone-50" />
            ) : (
              <>
                <ShoppingBag size={14} />
                Add to cart
              </>
            )}
          </motion.button>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-stone-950 group-hover:text-stone-600 transition-colors leading-snug line-clamp-2">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{product.category}</Badge>
            <span className="text-sm font-semibold text-stone-950">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
