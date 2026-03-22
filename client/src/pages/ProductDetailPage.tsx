import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Minus, Plus, Package } from 'lucide-react';
import api from '@/lib/axios';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Badge from '@/components/ui/Badge';
import Spinner, { PageSpinner } from '@/components/ui/Spinner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      info('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      success(`${product.name} added to cart`);
    } catch {
      error('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (notFound || !product) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-stone-500 mb-4">Product not found</p>
        <Link to="/products" className="btn-primary">Back to shop</Link>
      </div>
    );
  }

  const images = product.images.length > 0
    ? product.images
    : [`https://picsum.photos/seed/${product._id}/800/800`];

  const maxQty = Math.min(product.stock, 10);
  const inStock = product.stock > 0;

  return (
    <div className="container-custom py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
        <Link to="/" className="hover:text-stone-700 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-stone-700 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-stone-700 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Images */}
        <div>
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="aspect-square overflow-hidden bg-stone-100 mb-4"
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 overflow-hidden flex-shrink-0 border-2 transition-colors rounded-lg ${
                    selectedImage === i ? 'border-stone-950' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <Badge variant="outline" className="w-fit mb-4">{product.category}</Badge>

          <h1 className="text-3xl sm:text-4xl font-bold text-stone-950 leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-stone-950">
              {formatPrice(product.price)}
            </span>
            <div className={`flex items-center gap-1.5 text-sm ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
              <Package size={14} />
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          </div>

          <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>

          {/* Quantity */}
          {inStock && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-stone-700">Quantity</span>
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
                  disabled={quantity >= maxQty}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className="btn-primary flex-1 py-4 text-base justify-center"
            >
              {adding ? (
                <Spinner size="sm" className="border-stone-700 border-t-stone-50" />
              ) : (
                <>
                  <ShoppingBag size={18} />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </button>
            <Link to="/products" className="btn-secondary py-4 flex items-center gap-2 justify-center">
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-8 pt-8 border-t border-stone-100 grid grid-cols-2 gap-4 text-xs text-stone-500">
            <div>Free delivery on orders over KES 10,000</div>
            <div>7-day hassle-free returns</div>
            <div>M-Pesa & card accepted</div>
            <div>Support Mon–Fri, 8am–6pm EAT</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
