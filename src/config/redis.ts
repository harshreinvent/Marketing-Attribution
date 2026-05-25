import { Redis } from '@upstash/redis'
import { env } from './env'

function createRedisClient(): Redis {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    // Stub — cache operations will be no-ops; never crashes the server
    return {
      get:  async () => null,
      set:  async () => null,
      del:  async () => null,
      keys: async () => [],
      ping: async () => { throw new Error('Redis not configured') },
    } as unknown as Redis
  }
  return new Redis({
    url:   env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })
}

export const redis = createRedisClient()
