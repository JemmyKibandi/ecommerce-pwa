import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Sparkles, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';
import type { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import Spinner from '@/components/ui/Spinner';

export default function VisualSearchPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImage(file);
    setResults([]);
    setSearched(false);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const clearImage = () => {
    setImage(null);
    setPreview('');
    setResults([]);
    setSearched(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSearch = async () => {
    if (!image) return;
    setSearching(true);
    setSearched(false);
    try {
      const formData = new FormData();
      formData.append('image', image);
      const { data } = await api.post('/visual-search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(data.products ?? []);
      setUsingMock(data.usingMockEmbedding ?? false);
      setSearched(true);
    } catch (err: any) {
      setResults([]);
      setSearched(true);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="container-custom py-14">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 text-violet-600 text-xs uppercase tracking-[0.25em] mb-4">
          <Sparkles size={14} /> AI-Powered
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-950 mb-4">Visual Search</h1>
        <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
          Upload a photo of any product — our AI will find similar items in the store instantly.
        </p>
      </motion.div>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-xl mx-auto mb-12"
      >
        {preview ? (
          <div className="space-y-4">
            <div className="relative border border-stone-200 overflow-hidden aspect-square max-h-80 mx-auto w-full max-w-sm rounded-xl">
              <img src={preview} alt="Uploaded" className="w-full h-full object-contain bg-stone-50" />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 w-8 h-8 bg-stone-950 text-white flex items-center justify-center hover:bg-stone-700 transition-colors rounded-full"
              >
                <X size={14} />
              </button>
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="btn-primary w-full py-4 text-base justify-center"
            >
              {searching ? (
                <><Spinner size="sm" className="border-stone-700 border-t-stone-50" /> Searching...</>
              ) : (
                <><Sparkles size={17} /> Search for Similar Products</>
              )}
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed transition-colors cursor-pointer p-16 text-center rounded-2xl ${
              isDragging
                ? 'border-violet-500 bg-violet-50'
                : 'border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-white'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-violet-100 flex items-center justify-center rounded-full">
                {isDragging ? (
                  <Upload size={28} className="text-violet-600" />
                ) : (
                  <Camera size={28} className="text-violet-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-stone-700 mb-1">
                  {isDragging ? 'Drop it here' : 'Upload an image to search'}
                </p>
                <p className="text-sm text-stone-400">Drag & drop or click to browse</p>
                <p className="text-xs text-stone-300 mt-1">PNG, JPG, WEBP up to 10 MB</p>
              </div>
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
      </motion.div>

      {/* Mock embedding warning */}
      {searched && usingMock && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl mx-auto mb-8 flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 text-sm text-amber-700 rounded-xl"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>Results are based on mock embeddings. Add an <code className="font-mono text-xs">OPENAI_API_KEY</code> to the server for real AI visual search.</p>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-stone-950 mb-6 text-center">
              {results.length > 0
                ? `Found ${results.length} similar product${results.length !== 1 ? 's' : ''}`
                : 'No similar products found'}
            </h2>
            {results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
