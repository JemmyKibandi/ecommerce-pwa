import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import Product from './models/Product';
import User from './models/User';
import { generateTextEmbedding } from './services/embedding';

dotenv.config();

const products = [
  {
    name: 'Premium Wireless Headphones',
    description: 'Immersive sound quality with active noise cancellation. 30-hour battery life, comfortable over-ear design, and a premium carrying case included. Perfect for commuting on Nairobi roads.',
    price: 38999,
    images: ['https://picsum.photos/seed/headphones1/600/600'],
    imageUrl: 'https://picsum.photos/seed/headphones1/600/600',
    category: 'Electronics',
    stock: 45,
    tags: ['headphones', 'wireless', 'audio', 'noise-cancelling'],
  },
  {
    name: 'Kenyan Leather Handbag',
    description: 'Handcrafted in Nairobi from premium full-grain Kenyan leather. Spacious interior with suede lining, gold-tone hardware, and a detachable strap. Each bag is unique.',
    price: 8500,
    images: ['https://picsum.photos/seed/leatherbag1/600/600'],
    imageUrl: 'https://picsum.photos/seed/leatherbag1/600/600',
    category: 'Accessories',
    stock: 30,
    tags: ['bag', 'leather', 'kenyan', 'handcrafted', 'handbag'],
  },
  {
    name: 'Ankara Print Wrap Dress',
    description: 'Vibrant ankara print wrap dress crafted from high-quality Dutch wax fabric. A statement piece for Nairobi\'s fashion-forward woman. Ideal for office or weekend outings.',
    price: 4500,
    images: ['https://picsum.photos/seed/ankara1/600/600'],
    imageUrl: 'https://picsum.photos/seed/ankara1/600/600',
    category: 'Clothing',
    stock: 80,
    tags: ['ankara', 'dress', 'african print', 'wax fabric', 'fashion'],
  },
  {
    name: 'Kenyan AA Coffee Gift Set',
    description: 'Premium Kenyan AA grade single-origin coffee, sourced from the slopes of Mt. Kenya. Includes 500g whole beans and a handcrafted sisal gift bag. Rich, bold flavour.',
    price: 3200,
    images: ['https://picsum.photos/seed/coffee1/600/600'],
    imageUrl: 'https://picsum.photos/seed/coffee1/600/600',
    category: 'Home & Garden',
    stock: 60,
    tags: ['coffee', 'kenyan coffee', 'AA grade', 'gift', 'single origin'],
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your runs along Karura Forest and Ngong Hills trails. Heart rate, GPS, sleep tracking, and 7-day battery life. Water resistant to 50m. Pairs with iOS and Android.',
    price: 18999,
    images: ['https://picsum.photos/seed/smartwatch1/600/600'],
    imageUrl: 'https://picsum.photos/seed/smartwatch1/600/600',
    category: 'Electronics',
    stock: 55,
    tags: ['watch', 'fitness', 'smartwatch', 'GPS', 'health'],
  },
  {
    name: 'Slim Fit Linen Chinos',
    description: 'Breathable slim-fit linen trousers perfect for Nairobi\'s warm climate. Wrinkle-resistant stretch fabric for all-day comfort, whether in the CBD or Westlands.',
    price: 5999,
    images: ['https://picsum.photos/seed/chinos1/600/600'],
    imageUrl: 'https://picsum.photos/seed/chinos1/600/600',
    category: 'Clothing',
    stock: 100,
    tags: ['trousers', 'chinos', 'linen', 'slim-fit', 'menswear'],
  },
  {
    name: 'Maasai Beaded Jewellery Set',
    description: 'Authentic Maasai beadwork bracelet and earring set, handmade by artisans in the Rift Valley. Vibrant multicolour beads on brass wire. A proud Kenyan craft.',
    price: 2200,
    images: ['https://picsum.photos/seed/maasai1/600/600'],
    imageUrl: 'https://picsum.photos/seed/maasai1/600/600',
    category: 'Accessories',
    stock: 90,
    tags: ['maasai', 'beaded', 'jewellery', 'handmade', 'kenyan craft'],
  },
  {
    name: '4K Webcam Pro',
    description: 'Professional 4K webcam with auto-focus, noise-cancelling dual microphone, and HDR support. Plug-and-play USB-C. Ideal for remote work and online meetings from Nairobi.',
    price: 25999,
    images: ['https://picsum.photos/seed/webcam1/600/600'],
    imageUrl: 'https://picsum.photos/seed/webcam1/600/600',
    category: 'Electronics',
    stock: 25,
    tags: ['webcam', '4K', 'streaming', 'work-from-home', 'camera'],
  },
  {
    name: 'Kikoy Beach Wrap',
    description: 'Traditional Kenyan kikoy woven on the coast. 100% cotton, lightweight and versatile — use as a sarong, beach towel, or throw. Available in vibrant coastal stripe patterns.',
    price: 2500,
    images: ['https://picsum.photos/seed/kikoy1/600/600'],
    imageUrl: 'https://picsum.photos/seed/kikoy1/600/600',
    category: 'Clothing',
    stock: 70,
    tags: ['kikoy', 'beach', 'wrap', 'kenyan', 'cotton'],
  },
  {
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'Hand-thrown ceramic pour-over set including dripper, carafe, and two mugs. Designed for brewing Kenyan single-origin coffee at home. Dishwasher safe, matte earth-tone finish.',
    price: 12500,
    images: ['https://picsum.photos/seed/pourover1/600/600'],
    imageUrl: 'https://picsum.photos/seed/pourover1/600/600',
    category: 'Home & Garden',
    stock: 35,
    tags: ['coffee', 'ceramic', 'pour-over', 'kitchen', 'handmade'],
  },
  {
    name: 'Insulated Safari Water Bottle',
    description: 'Double-walled vacuum insulated 750ml bottle. Keeps water cold 24h in Nairobi\'s heat. Leak-proof, BPA-free stainless steel. Essential for safaris, hikes, and city commutes.',
    price: 5499,
    images: ['https://picsum.photos/seed/bottle1/600/600'],
    imageUrl: 'https://picsum.photos/seed/bottle1/600/600',
    category: 'Accessories',
    stock: 120,
    tags: ['bottle', 'water', 'insulated', 'safari', 'eco-friendly'],
  },
  {
    name: 'Nairobi Artisan Scented Candle',
    description: 'Hand-poured soy candle blended with Kenyan jasmine and cedar wood essential oils. Burns cleanly for 60 hours. Packaged in a recycled glass jar with a linen label.',
    price: 1850,
    images: ['https://picsum.photos/seed/candle1/600/600'],
    imageUrl: 'https://picsum.photos/seed/candle1/600/600',
    category: 'Home & Garden',
    stock: 40,
    tags: ['candle', 'scented', 'soy', 'kenyan jasmine', 'home decor'],
  },
];

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Product.deleteMany({});
  await User.deleteMany({});

  console.log('Seeding products with embeddings...');
  for (const p of products) {
    const embeddingText = [p.name, p.description, ...p.tags].join(' ');
    const embedding = await generateTextEmbedding(embeddingText);
    await Product.create({ ...p, embedding });
    process.stdout.write('.');
  }
  console.log('\nProducts seeded.');

  console.log('Creating admin user...');
  await User.create({
    name: 'Jemima Kibandi',
    email: 'admin@shopcraft.com',
    password: 'admin123456',
    role: 'admin',
  });

  console.log('Creating test user...');
  await User.create({
    name: 'Test User',
    email: 'user@shopcraft.com',
    password: 'user123456',
    role: 'user',
  });

  console.log('\nSeed complete!');
  console.log('  Admin: admin@shopcraft.com / admin123456');
  console.log('  User:  user@shopcraft.com  / user123456');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
