import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';
import type { Order } from '@/types';
import { formatPrice, formatDate, STATUS_LABELS, STATUS_COLORS } from '@/lib/utils';
import { PageSpinner } from '@/components/ui/Spinner';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageSpinner />;

  return (
    <div className="container-custom py-16 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-6"
        >
          <CheckCircle size={40} className="text-emerald-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-stone-950 mb-3">Order Confirmed!</h1>
        <p className="text-stone-500">
          Thank you for your purchase. We'll get started on it right away.
        </p>
        {order && (
          <p className="text-xs text-stone-400 mt-2 font-mono">Order #{order._id}</p>
        )}
      </motion.div>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Status */}
          <div className="flex items-center justify-between p-4 border border-stone-100 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Package size={18} className="text-stone-500" />
              <span className="text-sm font-medium text-stone-700">Order Status</span>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          {/* Items */}
          <div className="border border-stone-100 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-950">Items ordered</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <span className="font-medium text-stone-800">{item.name}</span>
                    <span className="text-stone-400 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium text-stone-950">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-stone-100 flex justify-between font-semibold text-stone-950">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          {/* Shipping */}
          <div className="border border-stone-100 p-4 rounded-xl">
            <h2 className="text-sm font-semibold text-stone-950 mb-3">Shipping to</h2>
            <address className="not-italic text-sm text-stone-600 space-y-0.5">
              <div className="font-medium text-stone-800">{order.shippingAddress.fullName}</div>
              <div>{order.shippingAddress.address}</div>
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </div>
              <div>{order.shippingAddress.country}</div>
            </address>
          </div>

          <div className="text-xs text-stone-400 text-center">
            Placed on {formatDate(order.createdAt)}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 mt-10"
      >
        <Link to="/products" className="btn-primary flex-1 justify-center py-4">
          Continue shopping <ArrowRight size={15} />
        </Link>
        <Link to="/" className="btn-secondary flex-1 justify-center py-4">
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
