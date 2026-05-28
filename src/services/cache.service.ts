import { redis } from '../config/redis'

const TTL = 60 * 60  // 1 hour

export const cacheService = {
  async getCached<T>(key: string): Promise<T | null> {
    try {
      return await redis.get<T>(key)
    } catch {
      return null  // cache failures are always non-fatal
    }
  },

  async setCached<T>(key: string, value: T): Promise<void> {
    try {
      await redis.set(key, value, { ex: TTL })
    } catch {
      // non-fatal
    }
  },

  async invalidateClientCache(clientId: string): Promise<void> {
    try {
      const keys = await redis.keys(`dashboard:${clientId}:*`)
      if (keys.length) await redis.del(...keys)
    } catch {
      // non-fatal
    }
  },
}
