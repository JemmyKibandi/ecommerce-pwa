import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Spinner from '@/components/ui/Spinner';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      error(err.response?.data?.message ?? 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'user') => {
    setForm({
      email: role === 'admin' ? 'admin@shopcraft.com' : 'user@shopcraft.com',
      password: role === 'admin' ? 'admin123456' : 'user123456',
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="text-2xl font-bold text-stone-950">ShopCraft 🇰🇪</Link>
          <h1 className="text-2xl font-bold text-stone-950 mt-6 mb-2">Welcome back</h1>
          <p className="text-stone-500 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Demo credentials */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => fillDemo('user')}
            className="flex-1 text-xs py-2 border border-stone-200 text-stone-600 hover:border-stone-950 transition-colors rounded-lg"
          >
            Demo User
          </button>
          <button
            type="button"
            onClick={() => fillDemo('admin')}
            className="flex-1 text-xs py-2 border border-stone-200 text-stone-600 hover:border-stone-950 transition-colors rounded-lg"
          >
            Demo Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-500 mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              autoComplete="email"
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-500 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
                className="input-base pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 justify-center mt-2"
          >
            {loading ? <Spinner size="sm" className="border-stone-700 border-t-stone-50" /> : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-stone-950 hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
