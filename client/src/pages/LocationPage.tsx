import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';

const stores = [
  {
    name: 'ShopCraft — Westlands Flagship',
    address: 'Sarit Centre, Westlands, Nairobi',
    phone: '+254 700 000 000',
    hours: 'Mon–Sat 9am–8pm, Sun 11am–6pm',
    mapQuery: 'Sarit+Centre+Westlands+Nairobi+Kenya',
    area: 'Westlands',
    badge: 'Flagship Store',
  },
  {
    name: 'ShopCraft — Karen Branch',
    address: 'Karen Shopping Centre, Karen Road, Nairobi',
    phone: '+254 700 000 000',
    hours: 'Mon–Fri 9am–7pm, Sat–Sun 10am–6pm',
    mapQuery: 'Karen+Shopping+Centre+Nairobi+Kenya',
    area: 'Karen',
    badge: 'Branch',
  },
  {
    name: 'ShopCraft — Kilimani Hub',
    address: 'Yaya Centre, Argwings Kodhek Road, Kilimani, Nairobi',
    phone: '+254 700 000 000',
    hours: 'Mon–Sat 9am–8pm, Sun 11am–6pm',
    mapQuery: 'Yaya+Centre+Kilimani+Nairobi+Kenya',
    area: 'Kilimani',
    badge: 'Hub',
  },
  {
    name: 'ShopCraft — CBD Express',
    address: 'Standard Street, Nairobi CBD, Nairobi',
    phone: '+254 700 000 000',
    hours: 'Mon–Fri 8am–6pm, Sat 9am–4pm',
    mapQuery: 'Standard+Street+Nairobi+CBD+Kenya',
    area: 'CBD',
    badge: 'Express',
  },
];

const areaColors: Record<string, string> = {
  Westlands: 'bg-violet-100 text-violet-700',
  Karen: 'bg-emerald-100 text-emerald-700',
  Kilimani: 'bg-rose-100 text-rose-700',
  CBD: 'bg-amber-100 text-amber-700',
};

export default function LocationPage() {
  useEffect(() => {
    document.title = 'Find a Store — ShopCraft Nairobi';
    return () => { document.title = 'ShopCraft'; };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 py-24 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-emerald-200 text-xs uppercase tracking-[0.3em] mb-4">Visit us in person</p>
          <h1 className="text-5xl font-bold mb-4">Find a Store in Nairobi</h1>
          <p className="text-emerald-100 max-w-md mx-auto">
            Four convenient locations across Nairobi. Come see our full range in person — our team is ready to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8 text-sm">
            {['Westlands', 'Karen', 'Kilimani', 'CBD'].map((area) => (
              <span key={area} className="px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                {area}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Delivery note */}
      <div className="bg-stone-950 text-stone-300 text-sm text-center py-3 px-4">
        🚚 Free delivery within Nairobi on orders over <strong className="text-white">KES 10,000</strong> · Nationwide delivery available
      </div>

      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stores.map((store, i) => (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="border border-stone-100 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Embedded map via iframe (no API key needed) */}
                <div className="w-full h-52 bg-stone-100 overflow-hidden">
                  <iframe
                    title={`Map for ${store.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${store.mapQuery}&output=embed&zoom=15`}
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-bold text-stone-950">{store.name}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2 ${areaColors[store.area]}`}>
                      {store.badge}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3 text-sm text-stone-600">
                      <MapPin size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex gap-3 text-sm text-stone-600">
                      <Clock size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{store.hours}</span>
                    </div>
                    <div className="flex gap-3 text-sm text-stone-600">
                      <Phone size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{store.phone}</span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${store.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 btn-secondary text-sm py-2.5"
                  >
                    <Navigation size={14} />
                    Get Directions
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Delivery areas note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 bg-stone-50 border border-stone-100 rounded-2xl text-center"
          >
            <h3 className="text-xl font-bold text-stone-950 mb-3">We Deliver Across Kenya</h3>
            <p className="text-stone-500 max-w-lg mx-auto text-sm leading-relaxed mb-4">
              Can't visit us in person? We deliver to Westlands, Kilimani, Karen, Lavington, Kileleshwa, Upper Hill, Parklands, Ngong Road, Rongai, Thika Road, and all 47 counties nationwide.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {['Westlands', 'Kilimani', 'Karen', 'Lavington', 'Kileleshwa', 'Upper Hill', 'Parklands', 'Ngong Road', 'Rongai', 'Thika Road', 'Mombasa', 'Kisumu'].map((area) => (
                <span key={area} className="px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-600">
                  {area}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
