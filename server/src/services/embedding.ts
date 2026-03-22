import OpenAI from 'openai';

let _client: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!_client) _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _client;
}

/**
 * Generates a 1536-dim text embedding via OpenAI text-embedding-3-small.
 * Falls back to a deterministic mock when OPENAI_API_KEY is not set.
 */
export async function generateTextEmbedding(text: string): Promise<number[]> {
  const client = getClient();
  if (!client) {
    // Deterministic mock — preserves relative similarity within a session
    const seed = text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return Array.from({ length: 1536 }, (_, i) =>
      Math.sin(seed * (i + 1) * 0.001) * 0.5
    );
  }
  const res = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000),
  });
  return res.data[0].embedding;
}

/**
 * Generates an embedding from an image buffer.
 * Uses GPT-4o-mini vision to describe the image, then embeds the description.
 * Falls back to random mock when OPENAI_API_KEY is not set.
 */
export async function generateImageEmbedding(imageBuffer: Buffer, mimeType = 'image/jpeg'): Promise<number[]> {
  const client = getClient();
  if (!client) {
    console.warn('[embedding] OPENAI_API_KEY not set — returning mock image embedding');
    return Array.from({ length: 1536 }, (_, i) => Math.sin(i * 0.7) * 0.3);
  }

  const base64 = imageBuffer.toString('base64');

  // Step 1: describe the image
  const vision = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
          {
            type: 'text',
            text: 'Describe this product or fashion item in detail: type, style, colours, material, and any notable features. Be specific and concise.',
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  const description = vision.choices[0].message.content ?? '';

  // Step 2: embed the description
  return generateTextEmbedding(description);
}

/** Cosine similarity between two equal-length vectors */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}
