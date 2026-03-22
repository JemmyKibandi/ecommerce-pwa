import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, LogOut, LayoutDashboard, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

const navLinks = [
  { label: 'Shop', to: '/products' },
  { label: 'Categories', to: '/categories' },
  { label: 'Visual Search', to: '/visual-search', accent: true },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Find Location', to: '/location' },
];

const menuItemVariants = {
  closed: { x: -30, opacity: 0 },
  open: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    success('Signed out successfully');
    navigate('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm'
            : 'bg-white border-b border-stone-100'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold tracking-tight text-stone-950 hover:text-stone-600 transition-colors">
              ShopCraft <span className="text-xs font-normal text-stone-400 align-middle">🇰🇪</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(({ label, to, accent }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      accent
                        ? isActive
                          ? 'text-violet-700'
                          : 'text-violet-600 hover:text-violet-800'
                        : isActive
                        ? 'text-stone-950'
                        : 'text-stone-500 hover:text-stone-950'
                    }`
                  }
                >
                  {accent && <Camera size={14} />}
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-stone-600 hover:text-stone-950 transition-colors"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-stone-950 text-stone-50 text-[10px] font-bold"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </Link>

              {/* Auth — desktop */}
              <div className="hidden lg:flex items-center gap-2 ml-2">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-950 px-3 py-1.5 border border-stone-200 hover:border-stone-950 transition-colors rounded-lg">
                        <LayoutDashboard size={13} /> Admin
                      </Link>
                    )}
                    <span className="text-sm text-stone-500 px-2">{user?.name?.split(' ')[0]}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-950 transition-colors px-2 py-1"
                    >
                      <LogOut size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
                    <Link to="/register" className="btn-primary text-sm py-2 px-4">Get started</Link>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 text-stone-700 hover:text-stone-950 transition-colors ml-1"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-stone-950 flex flex-col pt-16"
          >
            <div className="flex-1 flex flex-col justify-center px-8">
              <nav className="space-y-2">
                {navLinks.map(({ label, to, accent }, i) => (
                  <motion.div
                    key={to}
                    custom={i}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuItemVariants}
                  >
                    <NavLink
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block text-4xl font-bold py-2 transition-colors ${
                          isActive
                            ? accent ? 'text-violet-400' : 'text-white'
                            : accent
                            ? 'text-violet-500 hover:text-violet-300'
                            : 'text-stone-400 hover:text-white'
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-12 pt-8 border-t border-stone-800 space-y-3"
              >
                {isAuthenticated ? (
                  <>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 text-stone-400 hover:text-white text-sm"
                      >
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <p className="text-stone-500 text-sm">Signed in as {user?.name}</p>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="flex items-center gap-2 text-stone-400 hover:text-white text-sm transition-colors"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 transition-colors text-sm rounded-xl">
                      Sign in
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 bg-white text-stone-950 hover:bg-stone-100 transition-colors text-sm font-medium rounded-xl">
                      Get started
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
