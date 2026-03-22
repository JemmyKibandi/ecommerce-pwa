import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImagePlus, X } from 'lucide-react';
import api from '@/lib/axios';
import { useToast } from '@/contexts/ToastContext';
import Spinner from '@/components/ui/Spinner';

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  tags: string;
}

const INITIAL: FormData = {
  name: '', description: '', price: '', category: '', stock: '', tags: '',
};

const CATEGORIES = ['Electronics', 'Clothing', 'Accessories', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Other'];

export default function AdminUploadPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>(INITIAL);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(!!id);
  const isEdit = !!id;

  // Load existing product for editing
  useEffect(() => {
    if (!id) return;
    api.get(`/products/${id}`)
      .then(({ data }) => {
        const p = data.product;
        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          category: p.category,
          stock: String(p.stock),
          tags: (p.tags ?? []).join(', '),
        });
        const img = p.imageUrl || p.images?.[0] || '';
        if (img) setImagePreview(img);
      })
      .catch(() => error('Failed to load product'))
      .finally(() => setLoadingProduct(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.stock) {
      error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      if (isEdit) {
        await api.put(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        success('Product updated successfully');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (err: any) {
      error(err.response?.data?.message ?? 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  );

  const field = (
    label: string,
    key: keyof FormData,
    opts?: Partial<React.InputHTMLAttributes<HTMLInputElement>>,
    required = true
  ) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        {...opts}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="input-base"
        required={required}
      />
    </div>
  );

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-950">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="text-stone-500 text-sm mt-1">
          {isEdit ? 'Update product details and image' : 'Fill in the details to add a product to the store'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            {field('Product Name', 'name', { placeholder: 'e.g. Premium Leather Jacket' })}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                placeholder="Describe the product in detail..."
                className="input-base resize-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('Price ($)', 'price', { type: 'number', min: '0', step: '0.01', placeholder: '0.00' })}
              {field('Stock', 'stock', { type: 'number', min: '0', placeholder: '0' })}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="input-base"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {field('Tags', 'tags', { placeholder: 'leather, jacket, brown (comma-separated)' }, false)}
            <p className="text-xs text-stone-400">
              Tags improve product searchability and AI visual search accuracy.
            </p>
          </motion.div>

          {/* Right column — image upload */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
              Product Image
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative border-2 border-dashed border-stone-200 hover:border-stone-400 transition-colors cursor-pointer aspect-square flex items-center justify-center bg-stone-50 overflow-hidden rounded-xl"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); clearImage(); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-stone-950/70 text-white flex items-center justify-center hover:bg-stone-950 rounded-full"
                  >
                    <X size={13} />
                  </button>
                </>
              ) : (
                <div className="text-center p-6">
                  <ImagePlus size={32} className="text-stone-300 mx-auto mb-3" />
                  <p className="text-sm text-stone-400">Click to upload image</p>
                  <p className="text-xs text-stone-300 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 text-xs text-blue-700 space-y-1 rounded-xl">
              <p className="font-semibold">AI Embedding Note</p>
              <p>When you save this product, an AI embedding is automatically generated from the name, description, and tags. This powers the visual search feature.</p>
              {!import.meta.env.VITE_OPENAI_ENABLED && (
                <p className="text-blue-500">Set OPENAI_API_KEY on the server for real embeddings. Currently using mock embeddings.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-stone-100">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary py-3 px-8 text-sm justify-center"
          >
            {submitting ? (
              <><Spinner size="sm" className="border-stone-700 border-t-stone-50" /> Saving...</>
            ) : (
              isEdit ? 'Update Product' : 'Create Product'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-secondary py-3 px-6 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
