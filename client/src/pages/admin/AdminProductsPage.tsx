import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react';
import api from '@/lib/axios';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';
import Spinner, { PageSpinner } from '@/components/ui/Spinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { success, error } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (search) params.set('search', search);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
    } catch {
      error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      success('Product deleted');
    } catch {
      error('Failed to delete product');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-950">Products</h1>
          <p className="text-stone-500 text-sm mt-1">{products.length} products total</p>
        </div>
        <Link to="/admin/upload" className="btn-primary py-2 px-5 text-sm">
          <PlusCircle size={15} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-9 text-sm"
        />
      </div>

      {loading ? (
        <PageSpinner />
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          No products found. <Link to="/admin/upload" className="text-stone-950 underline">Add one.</Link>
        </div>
      ) : (
        <div className="bg-white border border-stone-100 overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left bg-stone-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Product</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Category</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Price</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Stock</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Tags</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products.map((p, i) => {
                  const img = p.imageUrl || p.images?.[0] || `https://picsum.photos/seed/${p._id}/80/80`;
                  return (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={img} alt={p.name} className="w-10 h-10 object-cover bg-stone-100 shrink-0 rounded-lg" />
                          <span className="font-medium text-stone-800 max-w-[160px] truncate">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-500">{p.category}</td>
                      <td className="px-5 py-4 font-semibold text-stone-950">{formatPrice(p.price)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(p.tags ?? []).slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/upload/${p._id}`}
                            className="p-1.5 text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors rounded-lg"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          {confirmId === p._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(p._id)}
                                disabled={deletingId === p._id}
                                className="text-xs px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg"
                              >
                                {deletingId === p._id ? <Spinner size="sm" className="border-red-300 border-t-white" /> : 'Confirm'}
                              </button>
                              <button onClick={() => setConfirmId(null)} className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded-lg">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmId(p._id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
