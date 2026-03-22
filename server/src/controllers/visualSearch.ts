import { Request, Response } from 'express';
import Product from '../models/Product';
import { generateImageEmbedding, cosineSimilarity } from '../services/embedding';

export const visualSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Image file is required' });
      return;
    }

    const queryEmbedding = await generateImageEmbedding(
      req.file.buffer,
      req.file.mimetype
    );

    let products;

    // Try Atlas $vectorSearch first (requires vector index on Atlas)
    const vectorIndex = process.env.ATLAS_VECTOR_INDEX_NAME;
    if (vectorIndex) {
      try {
        products = await Product.aggregate([
          {
            $vectorSearch: {
              index: vectorIndex,
              path: 'embedding',
              queryVector: queryEmbedding,
              numCandidates: 100,
              limit: 8,
            },
          },
          {
            $addFields: { score: { $meta: 'vectorSearchScore' } },
          },
        ]);
      } catch (err) {
        console.warn('[visual-search] Atlas vector search failed, using fallback:', err);
        products = null;
      }
    }

    // Fallback: in-memory cosine similarity
    if (!products) {
      const all = await Product.find({ embedding: { $exists: true, $ne: [] } }).lean();
      products = all
        .map((p) => ({
          ...p,
          score: cosineSimilarity(queryEmbedding, p.embedding ?? []),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
    }

    res.json({ success: true, products, usingMockEmbedding: !process.env.OPENAI_API_KEY });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
