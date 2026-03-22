import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/axios';
import type { Product, Pagination } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { PageSpinner } from '@/components/ui/Spinner';

const LIMIT = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryParam = searchParams.get('category') ?? '';
  const searchParam = searchParams.get('search') ?? '';
  const pageParam = parseInt(searchParams.get('page') ?? '1');

  const [searchInput, setSearchInput] = useState(searchParam);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(LIMIT),
      });
      if (categoryParam) params.set('category', categoryParam);
      if (searchParam) params.set('search', searchParam);

      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryParam, searchParam, pageParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => {
      setCategories(['All', ...data.categories]);
    });
  }, []);

  const setCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All' || cat === '') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    next.delete('page');
    setSearchParams(next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      next.set('search', searchInput.trim());
    } else {
      next.delete('search');
    }
    next.delete('page');
    setSearchParams(next);
  };

  const clearSearch = () => {
    setSearchInput('');
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    next.delete('page');
    setSearchParams(next);
  };

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCategory = categoryParam || 'All';

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="section-title mb-2">All Products</h1>
        {pagination && (
          <p className="text-stone-500 text-sm">
            {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
          </p>
        )}
      </motion.div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-base pl-10 pr-10"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
          <SlidersHorizontal size={15} className="text-stone-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors rounded-full ${
                activeCategory === cat
                  ? 'bg-stone-950 text-stone-50'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters */}
      {(searchParam || categoryParam) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {searchParam && (
            <span className="flex items-center gap-1.5 text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full">
              Search: "{searchParam}"
              <button onClick={clearSearch} className="hover:text-stone-950"><X size={12} /></button>
            </span>
          )}
          {categoryParam && (
            <span className="flex items-center gap-1.5 text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full">
              {categoryParam}
              <button onClick={() => setCategory('All')} className="hover:text-stone-950"><X size={12} /></button>
            </span>
          )}
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <PageSpinner />
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-stone-400 text-lg mb-2">No products found</p>
          <p className="text-stone-300 text-sm">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(pageParam - 1)}
            disabled={pageParam <= 1}
            className="px-4 py-2 border border-stone-200 text-sm text-stone-600 hover:border-stone-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg"
          >
            Previous
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 text-sm font-medium transition-colors rounded-lg ${
                p === pageParam
                  ? 'bg-stone-950 text-stone-50'
                  : 'border border-stone-200 text-stone-600 hover:border-stone-950'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(pageParam + 1)}
            disabled={pageParam >= pagination.pages}
            className="px-4 py-2 border border-stone-200 text-sm text-stone-600 hover:border-stone-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
