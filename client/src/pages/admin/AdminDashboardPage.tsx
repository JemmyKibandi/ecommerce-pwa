import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, Tag, PlusCircle } from 'lucide-react';
import api from '@/lib/axios';
import type { Product } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { PageSpinner } from '@/components/ui/Spinner';

interface Stats {
  totalProducts: number;
  lowStockProducts: number;
  totalCategories: number;
}

const statCards = (s: Stats) => [
  { label: 'Total Products', value: s.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
  { label: 'Low Stock', value: s.lowStockProducts, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
  { label: 'Categories', value: s.totalCategories, icon: Tag, color: 'bg-emerald-50 text-emerald-600' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/admin/stats')
      .then(({ data }) => {
        setStats(data.stats);
        setRecent(data.recentProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-950">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Welcome back, Jemima</p>
        </div>
        <Link to="/admin/upload" className="btn-primary py-2 px-5 text-sm">
          <PlusCircle size={15} /> Add Product
        </Link>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {statCards(stats).map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-stone-100 p-6 flex items-center gap-4 rounded-xl"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-950">{value}</p>
                <p className="text-xs text-stone-500 mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recent products */}
      <div className="bg-white border border-stone-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-50">
          <h2 className="text-sm font-semibold text-stone-950">Recent Products</h2>
          <Link to="/admin/products" className="text-xs text-stone-500 hover:text-stone-950 transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-50 text-left">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-widest text-stone-400">Product</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-widest text-stone-400">Category</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-widest text-stone-400">Price</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-widest text-stone-400">Stock</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-widest text-stone-400">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {recent.map((p) => {
                const img = p.imageUrl || p.images?.[0] || `https://picsum.photos/seed/${p._id}/80/80`;
                return (
                  <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={img} alt={p.name} className="w-10 h-10 object-cover bg-stone-100 rounded-lg" />
                      <span className="font-medium text-stone-800 truncate max-w-[180px]">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 text-stone-500">{p.category}</td>
                    <td className="px-6 py-4 font-medium text-stone-950">{formatPrice(p.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-400">{formatDate(p.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
