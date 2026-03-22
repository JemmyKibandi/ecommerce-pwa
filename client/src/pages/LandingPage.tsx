import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Truck, Shield, RefreshCw, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/axios';
import type { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { PageSpinner } from '@/components/ui/Spinner';

// ─── Hero slides ────────────────────────────────────────────────────────────

const slides = [
  {
    headline: 'Nairobi\'s Premier\nOnline Store',
    sub: 'Curated fashion, electronics, and artisan goods — delivered across Kenya with pride.',
    cta: 'Shop Collection',
    ctaTo: '/products',
    gradient: 'from-rose-600/80 via-pink-700/70 to-fuchsia-800/80',
    img: 'https://picsum.photos/seed/hero-nairobi/1400/700',
  },
  {
    headline: 'Kenyan Crafts,\nGlobal Quality',
    sub: 'Discover handcrafted leather goods, ankara prints, Maasai jewellery, and more from local artisans.',
    cta: 'Explore Local',
    ctaTo: '/categories',
    gradient: 'from-emerald-600/80 via-teal-700/70 to-cyan-800/80',
    img: 'https://picsum.photos/seed/hero-kenyan/1400/700',
  },
  {
    headline: 'Find What You Feel',
    sub: 'Upload a photo and let AI find the perfect match in our store in seconds.',
    cta: 'Try Visual Search',
    ctaTo: '/visual-search',
    gradient: 'from-indigo-700/80 via-violet-700/70 to-purple-800/80',
    img: 'https://picsum.photos/seed/hero-minimal/1400/700',
  },
];

const textVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.12 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};
const childVariant = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

// ─── Category cards ──────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, string> = {
  Electronics: 'from-blue-500 to-indigo-600',
  Clothing: 'from-rose-500 to-pink-600',
  Accessories: 'from-amber-500 to-orange-600',
  'Home & Garden': 'from-emerald-500 to-teal-600',
  Sports: 'from-violet-500 to-purple-600',
  Beauty: 'from-fuchsia-500 to-pink-600',
  Books: 'from-stone-500 to-stone-700',
  Other: 'from-slate-500 to-slate-700',
};

const features = [
  { icon: Truck, title: 'Nairobi Delivery', desc: 'Same-day delivery across Nairobi' },
  { icon: Shield, title: 'M-Pesa Accepted', desc: 'Secure payments via M-Pesa & card' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: Camera, title: 'Visual Search', desc: 'Find products with a photo' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [goTo, current]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [goTo, current]);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=4').then(({ data }) => setFeatured(data.products)),
      api.get('/products/categories').then(({ data }) => setCategories(data.categories.slice(0, 6))),
    ]).finally(() => setLoadingProducts(false));
  }, []);

  const slide = slides[current];

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero Carousel ─── */}
      <section className="relative h-[92vh] min-h-[560px] overflow-hidden bg-stone-950">
        {/* Background image */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={`img-${current}`}
            src={slide.img}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`grad-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
          />
        </AnimatePresence>
        {/* Dark bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full container-custom flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-2xl"
            >
              <motion.p variants={childVariant} className="text-white/70 text-xs uppercase tracking-[0.35em] mb-5 font-medium">
                Nairobi, Kenya 🇰🇪
              </motion.p>
              <motion.h1
                variants={childVariant}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight mb-6 whitespace-pre-line"
              >
                {slide.headline}
              </motion.h1>
              <motion.p variants={childVariant} className="text-white/80 text-lg sm:text-xl mb-10 leading-relaxed max-w-lg">
                {slide.sub}
              </motion.p>
              <motion.div variants={childVariant} className="flex flex-wrap gap-4">
                <Link
                  to={slide.ctaTo}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-950 text-sm font-bold hover:bg-stone-100 transition-colors rounded-xl"
                >
                  {slide.cta} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 text-white text-sm font-medium hover:bg-white/10 transition-colors rounded-xl"
                >
                  Browse Categories
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-8 left-0 right-0 z-10 container-custom flex items-center justify-between">
          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          {/* Arrows */}
          <div className="flex gap-2">
            <button onClick={prev} className="w-10 h-10 border border-white/30 text-white hover:bg-white/10 flex items-center justify-center transition-colors rounded-lg">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="w-10 h-10 border border-white/30 text-white hover:bg-white/10 flex items-center justify-center transition-colors rounded-lg">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Features strip ─── */}
      <section className="bg-white border-b border-stone-100">
        <div className="container-custom py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-stone-100 bg-stone-50 rounded-lg">
                  <Icon size={17} className="text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-950">{title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      {categories.length > 0 && (
        <section className="py-20 bg-stone-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">Browse by type</p>
                <h2 className="section-title">Shop by Category</h2>
              </div>
              <Link to="/categories" className="hidden sm:flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors">
                All categories <ArrowRight size={14} />
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat, i) => {
                const gradient = CATEGORY_STYLES[cat] ?? 'from-stone-500 to-stone-700';
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      className={`group block relative overflow-hidden aspect-square bg-gradient-to-br ${gradient} text-white rounded-2xl`}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-sm font-bold leading-tight">{cat}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured Products ─── */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">Handpicked for you</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </motion.div>

          {loadingProducts ? (
            <PageSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featured.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link to="/products" className="btn-secondary">View all products</Link>
          </div>
        </div>
      </section>

      {/* ─── Visual Search CTA ─── */}
      <section className="py-20 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <img src="https://picsum.photos/seed/cta-ai/1400/500" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-violet-200 text-xs uppercase tracking-[0.25em] mb-5">
              <Camera size={14} /> AI-Powered Search
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
              See it. Search it.<br />Find it in Kenya.
            </h2>
            <p className="text-violet-200 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Upload any photo and our AI instantly finds visually similar products in our store. Try it — it's free.
            </p>
            <Link
              to="/visual-search"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-stone-950 text-sm font-bold hover:bg-stone-100 transition-colors rounded-xl"
            >
              <Camera size={17} /> Try Visual Search
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="bg-stone-950 py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-stone-500 text-xs uppercase tracking-[0.3em] mb-4">Fresh drops every week</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-stone-50 mb-6 tracking-tight">
              New arrivals every week.
            </h2>
            <p className="text-stone-400 mb-10 max-w-md mx-auto">
              Fresh Kenyan and international products added constantly. Quality verified. Fast Nairobi delivery.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-950 text-sm font-bold hover:bg-stone-100 transition-colors rounded-xl"
            >
              <ShoppingBag size={16} /> Browse the shop
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
