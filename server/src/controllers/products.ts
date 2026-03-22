import { Request, Response } from 'express';
import path from 'path';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { generateTextEmbedding } from '../services/embedding';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, page = '1', limit = '12' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.$text = { $search: search as string };

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock, tags } = req.body;

    const parsedTags: string[] = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    // If an image was uploaded, set imageUrl
    let imageUrl = req.body.imageUrl ?? '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Generate embedding from product text
    const embeddingText = [name, description, ...parsedTags].join(' ');
    const embedding = await generateTextEmbedding(embeddingText);

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      tags: parsedTags,
      imageUrl,
      images: imageUrl ? [imageUrl] : [],
      embedding,
    });

    // Return without embedding field
    const { embedding: _emb, ...productData } = product.toObject();
    res.status(201).json({ success: true, product: productData });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await Product.findById(req.params.id).select('+embedding');
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const { name, description, price, category, stock, tags } = req.body;

    const parsedTags: string[] = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : existing.tags;

    let imageUrl = existing.imageUrl ?? '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Regenerate embedding if text fields changed
    const textChanged =
      (name && name !== existing.name) ||
      (description && description !== existing.description) ||
      JSON.stringify(parsedTags) !== JSON.stringify(existing.tags);

    let embedding = existing.embedding;
    if (textChanged) {
      const embeddingText = [
        name ?? existing.name,
        description ?? existing.description,
        ...parsedTags,
      ].join(' ');
      embedding = await generateTextEmbedding(embeddingText);
    }

    const updates: Record<string, any> = { embedding };
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (price !== undefined) updates.price = parseFloat(price);
    if (category) updates.category = category;
    if (stock !== undefined) updates.stock = parseInt(stock);
    updates.tags = parsedTags;
    if (imageUrl) {
      updates.imageUrl = imageUrl;
      updates.images = [imageUrl];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, product });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [total, lowStock, categories, recent] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ stock: { $lte: 5 } }),
      Product.distinct('category'),
      Product.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts: total,
        lowStockProducts: lowStock,
        totalCategories: categories.length,
      },
      recentProducts: recent,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
