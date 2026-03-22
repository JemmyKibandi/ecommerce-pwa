import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

const CATEGORY_STYLES: Record<string, { gradient: string; img: string }> = {
  Electronics: {
    gradient: 'from-blue-600 to-indigo-700',
    img: 'https://picsum.photos/seed/electronics-cat/600/400',
  },
  Clothing: {
    gradient: 'from-rose-500 to-pink-600',
    img: 'https://picsum.photos/seed/clothing-cat/600/400',
  },
  Accessories: {
    gradient: 'from-amber-500 to-orange-600',
    img: 'https://picsum.photos/seed/accessories-cat/600/400',
  },
  'Home & Garden': {
    gradient: 'from-emerald-500 to-teal-600',
    img: 'https://picsum.photos/seed/home-cat/600/400',
  },
  Sports: {
    gradient: 'from-violet-600 to-purple-700',
    img: 'https://picsum.photos/seed/sports-cat/600/400',
  },
  Books: {
    gradient: 'from-stone-600 to-stone-800',
    img: 'https://picsum.photos/seed/books-cat/600/400',
  },
  Beauty: {
    gradient: 'from-fuchsia-500 to-pink-600',
    img: 'https://picsum.photos/seed/beauty-cat/600/400',
  },
  Other: {
    gradient: 'from-slate-500 to-slate-700',
    img: 'https://picsum.photos/seed/other-cat/600/400',
  },
};

const DEFAULT_STYLE = {
  gradient: 'from-stone-600 to-stone-800',
  img: 'https://picsum.photos/seed/default-cat/600/400',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/categories')
      .then(({ data }) => setCategories(data.categories))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 py-24 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-amber-100 text-xs uppercase tracking-[0.3em] mb-4">Browse by type</p>
          <h1 className="text-5xl font-bold mb-4">Categories</h1>
          <p className="text-amber-100 max-w-md mx-auto">Find exactly what you're looking for. Shop across all our product categories.</p>
        </motion.div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-stone-200 h-56 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, i) => {
                const style = CATEGORY_STYLES[cat] ?? DEFAULT_STYLE;
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="group"
                  >
                    <Link
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      className="block relative overflow-hidden h-56 rounded-2xl"
                    >
                      {/* Background image */}
                      <img
                        src={style.img}
                        alt={cat}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
                      {/* Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                        <h2 className="text-2xl font-bold mb-2">{cat}</h2>
                        <div className="flex items-center gap-1.5 text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                          Shop now <ArrowRight size={14} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
