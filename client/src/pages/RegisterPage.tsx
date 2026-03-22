import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Spinner from '@/components/ui/Spinner';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      error('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirm) {
      error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      success('Account created! Welcome to ShopCraft.');
      navigate('/');
    } catch (err: any) {
      error(err.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, opts?: Partial<React.InputHTMLAttributes<HTMLInputElement>>) => (
    <div>
      <label className="block text-xs font-medium uppercase tracking-widest text-stone-500 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          {...opts}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="input-base pr-10"
          required
        />
        {(key === 'password' || key === 'confirm') && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-bold text-stone-950 mt-6 mb-2">Create account</h1>
          <p className="text-stone-500 text-sm">Join ShopCraft and start exploring Kenya's best products</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('Full Name', 'name', { type: 'text', placeholder: 'John Doe', autoComplete: 'name' })}
          {field('Email', 'email', { type: 'email', placeholder: 'you@example.com', autoComplete: 'email' })}
          {field('Password', 'password', {
            type: showPassword ? 'text' : 'password',
            placeholder: '••••••••',
            autoComplete: 'new-password',
          })}
          {field('Confirm Password', 'confirm', {
            type: showPassword ? 'text' : 'password',
            placeholder: '••••••••',
            autoComplete: 'new-password',
          })}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 justify-center mt-2"
          >
            {loading ? (
              <Spinner size="sm" className="border-stone-700 border-t-stone-50" />
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-stone-950 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
