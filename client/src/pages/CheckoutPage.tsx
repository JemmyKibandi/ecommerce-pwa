import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/axios';
import type { ShippingAddress, CartItem } from '@/types';
import Spinner from '@/components/ui/Spinner';

interface FormData extends ShippingAddress {}

const INITIAL_FORM: FormData = {
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
};

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = true,
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-widest text-stone-500 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-base"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, totalPrice, refetchCart } = useCart();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const shippingCost = totalPrice >= 10000 ? 0 : 350;
  const grandTotal = totalPrice + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing = Object.entries(form).find(([, v]) => !v.trim());
    if (missing) {
      error('Please fill in all required fields');
      return;
    }

    if (cart.items.length === 0) {
      error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', { shippingAddress: form });
      await refetchCart();
      success('Order placed successfully!');
      navigate(`/order-success/${data.order._id}`);
    } catch (err: any) {
      error(err.response?.data?.message ?? 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-stone-500 mb-4">Your cart is empty.</p>
        <Link to="/products" className="btn-primary">Go shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-title mb-10"
      >
        Checkout
      </motion.h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Shipping form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-stone-950 mb-6">Shipping Information</h2>
          <div className="space-y-4">
            <FormField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Amina Hassan" />
            <FormField label="Street Address" name="address" value={form.address} onChange={handleChange} placeholder="e.g. Argwings Kodhek Road, Kilimani" />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="City / Area" name="city" value={form.city} onChange={handleChange} placeholder="e.g. Nairobi" />
              <FormField label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="e.g. 00100" />
            </div>
            <FormField label="Country" name="country" value={form.country} onChange={handleChange} placeholder="Kenya" />
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
            <p className="font-semibold mb-1">Payment Integration</p>
            <p>This is a demo — no real payment is processed. You can integrate <strong>M-Pesa (Daraja API)</strong>, Stripe, Flutterwave, or Pesapal by connecting your payment provider to the <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">POST /api/orders</code> route on the server.</p>
          </div>

          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800">
            <p className="font-semibold mb-1">🚚 Delivery Information</p>
            <p>Free delivery on orders over <strong>KES 10,000</strong>. Standard Nairobi delivery: <strong>KES 350</strong>. Nationwide delivery available — rates vary by county.</p>
          </div>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-stone-950 mb-6">Order Summary</h2>

          <div className="bg-stone-50 border border-stone-100 divide-y divide-stone-100">
            {cart.items.map((item: CartItem) => {
              const imageUrl = item.product.images[0] ?? `https://picsum.photos/seed/${item.product._id}/80/80`;
              return (
                <div key={item.product._id} className="flex items-center gap-4 p-4">
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-950 truncate">{item.product.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-stone-950 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}

            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
            </div>

            <div className="p-4 flex justify-between font-bold text-stone-950 text-base">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-4 text-base justify-center mt-6"
          >
            {submitting ? (
              <><Spinner size="sm" className="border-stone-700 border-t-stone-50" /> Placing order...</>
            ) : (
              `Place Order · ${formatPrice(grandTotal)}`
            )}
          </button>

          <p className="text-xs text-stone-400 text-center mt-3">
            By placing your order, you agree to our terms and conditions.
          </p>
        </motion.div>
      </form>
    </div>
  );
}
