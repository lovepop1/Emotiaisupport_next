import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!); // Ensure REDIS_URL is in .env

export async function getCachedEmbedding(text: string) {
  const cached = await redis.get(`embedding:${text}`);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheEmbedding(text: string, embedding: number[]) {
  await redis.setex(`embedding:${text}`, 86400, JSON.stringify(embedding)); // Cache for 24h
}
