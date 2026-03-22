import { Link } from 'react-router-dom';

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: 'Electronics', to: '/products?category=Electronics' },
    { label: 'Clothing', to: '/products?category=Clothing' },
    { label: 'Accessories', to: '/products?category=Accessories' },
  ],
  Explore: [
    { label: 'Categories', to: '/categories' },
    { label: 'Visual Search', to: '/visual-search' },
    { label: 'About Us', to: '/about' },
    { label: 'Find a Store', to: '/location' },
  ],
  Account: [
    { label: 'Sign In', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'My Cart', to: '/cart' },
    { label: 'Contact', to: '/contact' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-400 mt-auto">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold text-stone-50 block mb-3">
              ShopCraft
            </Link>
            <p className="text-sm leading-relaxed text-stone-500 max-w-xs mb-4">
              Nairobi's premium online marketplace. Quality products, delivered with care across Kenya.
            </p>
            <p className="text-xs text-stone-600">
              📍 Westlands, Nairobi, Kenya
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-stone-400 hover:text-stone-50 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            &copy; {year} ShopCraft. All rights reserved. Nairobi, Kenya.
          </p>
          <p className="text-xs text-stone-500">
            Built by{' '}
            <a
              href="https://jemima-five.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-300 hover:text-white transition-colors underline underline-offset-2"
            >
              Jemima Kibandi
            </a>
            {' · '}
            <a
              href="https://jemima-five.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-stone-200 transition-colors"
            >
              Portfolio ↗
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
