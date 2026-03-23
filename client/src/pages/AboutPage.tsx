import { motion } from 'framer-motion';
import { Heart, Leaf, Shield, Zap } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Customer First', desc: 'Every decision we make starts with you. Your satisfaction drives everything — from product curation to last-mile delivery across Nairobi.' },
  { icon: Leaf, title: 'Supporting Local', desc: 'We proudly partner with Kenyan artisans, designers, and makers — putting homegrown talent on a world-class platform.' },
  { icon: Shield, title: 'Quality Assured', desc: 'Every product is hand-selected for quality. If it\'s in our store, we stand behind it — whether it comes from Westlands or the Rift Valley.' },
  { icon: Zap, title: 'Fast & Reliable', desc: 'From checkout to your door — same-day delivery in Nairobi, fast M-Pesa payments, and responsive support in EAT timezone.' },
];

const team = [
  { name: 'Jemima Kibandi', role: 'Founder & CEO', img: 'https://picsum.photos/seed/person1/200/200' },
  { name: 'Betty Wangui', role: 'Head of Operations', img: 'https://picsum.photos/seed/person2/200/200' },
  { name: 'Njoki Kibandi', role: 'Head of Finance', img: 'https://picsum.photos/seed/person3/200/200' },
];

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '47', label: 'Counties Reached' },
  { value: '500+', label: 'Kenyan Products' },
  { value: '4', label: 'Nairobi Stores' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://picsum.photos/seed/nairobi-skyline/1400/600" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.p variants={fadeUp} className="text-violet-200 text-xs uppercase tracking-[0.3em] mb-4">Our Story · Nairobi, Kenya</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
              Built in Nairobi,<br />Made for Kenya
            </motion.h1>
            <motion.p variants={fadeUp} className="text-violet-100 text-lg max-w-2xl mx-auto leading-relaxed">
              ShopCraft was founded in the heart of Nairobi with one mission — to connect Kenyans with exceptional products, celebrate local craftsmanship, and make premium shopping accessible to everyone.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-stone-950 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl font-bold text-white mb-1">{value}</p>
                <p className="text-xs text-stone-400 uppercase tracking-widest">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://picsum.photos/seed/nairobi-market/700/500"
                alt="Nairobi market"
                className="w-full h-80 object-cover rounded-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-violet-600 mb-3">Our Mission</p>
              <h2 className="text-3xl font-bold text-stone-950 mb-5 leading-tight">
                Redefining how Kenya shops online
              </h2>
              <p className="text-stone-500 leading-relaxed mb-4">
                ShopCraft was built because we believed online shopping in Kenya could be better — faster, more trustworthy, and more authentically Kenyan. We set out to build the marketplace we always wanted to use.
              </p>
              <p className="text-stone-500 leading-relaxed">
                Today we serve thousands of customers across all 47 counties — from Westlands to Mombasa — with a curated mix of local artisan goods, trending fashion, electronics, and lifestyle products, powered by AI-driven discovery so you always find exactly what you're looking for.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-stone-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-violet-600 mb-3">What drives us</p>
            <h2 className="section-title">Our Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 border border-stone-100 rounded-xl"
              >
                <div className="w-10 h-10 bg-violet-50 flex items-center justify-center mb-4 rounded-lg">
                  <Icon size={20} className="text-violet-600" />
                </div>
                <h3 className="font-semibold text-stone-950 mb-2">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-violet-600 mb-3">The people behind it</p>
            <h2 className="section-title">Meet the Team</h2>
            <p className="text-stone-500 mt-3 max-w-md mx-auto text-sm">A passionate team of Nairobians building the future of Kenyan e-commerce.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-10">
            {team.map(({ name, role, img }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <img src={img} alt={name} className="w-24 h-24 object-cover rounded-full mx-auto mb-4 grayscale" />
                <p className="font-semibold text-stone-950">{name}</p>
                <p className="text-sm text-stone-400">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
