import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, CheckCircle, MapPin } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

const info = [
  { icon: Mail, label: 'Email', value: 'jemimakibandi@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+254 700 000 000' },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri, 8am–6pm EAT' },
  { icon: MapPin, label: 'Location', value: 'Westlands, Nairobi, Kenya' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending (no backend for contact form)
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  };

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-600 py-24 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-rose-200 text-xs uppercase tracking-[0.3em] mb-4">We're here for you</p>
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-rose-100 max-w-md mx-auto">Have a question, feedback, or need help? We'd love to hear from you. Based in Nairobi, serving all of Kenya.</p>
        </motion.div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-stone-950 mb-8">Contact Information</h2>
              <div className="space-y-6 mb-10">
                {info.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-rose-50 flex items-center justify-center shrink-0 rounded-lg">
                      <Icon size={18} className="text-rose-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{label}</p>
                      <p className="text-stone-800 font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl">
                <p className="text-sm font-semibold text-rose-800 mb-1">Average response time</p>
                <p className="text-sm text-rose-600">We aim to reply within 24 hours on business days (Mon–Fri, EAT).</p>
              </div>

              <div className="mt-6 p-4 bg-stone-50 border border-stone-100 rounded-xl text-sm text-stone-600">
                <p className="font-semibold text-stone-800 mb-1">M-Pesa & Delivery</p>
                <p>We support M-Pesa payments and deliver across all 47 counties in Kenya. Nairobi deliveries are fulfilled within 1–2 business days.</p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <CheckCircle size={48} className="text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold text-stone-950 mb-2">Message sent!</h3>
                  <p className="text-stone-500">Thanks for reaching out. We'll get back to you soon.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-secondary mt-6">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-2xl font-bold text-stone-950 mb-8">Send a Message</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Name</label>
                      <input name="name" value={form.name} onChange={change} placeholder="Your name" className="input-base" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Email</label>
                      <input name="email" type="email" value={form.email} onChange={change} placeholder="you@email.com" className="input-base" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Subject</label>
                    <select name="subject" value={form.subject} onChange={change} className="input-base" required>
                      <option value="">Select a subject</option>
                      <option>Order Support</option>
                      <option>Delivery Question</option>
                      <option>Product Question</option>
                      <option>Returns & Refunds</option>
                      <option>M-Pesa Payment Issue</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Message</label>
                    <textarea name="message" value={form.message} onChange={change} rows={5} placeholder="Tell us how we can help..." className="input-base resize-none" required />
                  </div>
                  <button type="submit" disabled={sending} className="btn-primary w-full py-3.5 justify-center">
                    {sending ? <Spinner size="sm" className="border-stone-700 border-t-stone-50" /> : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
