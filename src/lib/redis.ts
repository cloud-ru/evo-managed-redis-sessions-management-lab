import Redis from "ioredis";

const globalForRedis = global as unknown as { redis: Redis | undefined };

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: 5,
    connectTimeout: 10_000,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis; 