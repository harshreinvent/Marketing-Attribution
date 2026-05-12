import { Redis } from "@upstash/redis";
import { env } from "./env";

function createRedisClient(): Redis {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    // Stub so callers don't crash at import time — rate limiting already fails open
    return {
      incr: async () => { throw new Error("Redis not configured"); },
      expire: async () => { throw new Error("Redis not configured"); },
      ping: async () => { throw new Error("Redis not configured"); },
      get: async () => null,
      set: async () => null,
      del: async () => null,
    } as unknown as Redis;
  }
  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export const redis = createRedisClient();
