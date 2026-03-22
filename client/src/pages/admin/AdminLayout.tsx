import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, ArrowLeft } from 'lucide-react';

const sideLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package, end: false },
  { to: '/admin/upload', label: 'Add Product', icon: PlusCircle, end: false },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-stone-950 text-stone-300 flex flex-col">
        <div className="px-5 py-6 border-b border-stone-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-1">Admin</p>
          <p className="text-base font-bold text-stone-50">ShopCraft 🇰🇪</p>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-3">
          {sideLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-stone-800 text-stone-50'
                    : 'text-stone-400 hover:text-stone-50 hover:bg-stone-800/60'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-300 transition-colors"
          >
            <ArrowLeft size={13} /> Back to store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-stone-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
