import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-[8rem] font-black text-stone-100 leading-none select-none">404</p>
        <h1 className="text-2xl font-bold text-stone-950 -mt-4 mb-3">Page not found</h1>
        <p className="text-stone-500 mb-8 max-w-sm">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary">
            Go home
          </Link>
          <Link to="/products" className="btn-secondary">
            Browse products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
