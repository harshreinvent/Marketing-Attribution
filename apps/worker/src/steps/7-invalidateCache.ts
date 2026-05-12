import { redis } from "@repo/config";

export async function invalidateCache(clientId: string) {
  try {
    const keys = await redis.keys(`dashboard:${clientId}:*`);
    if (keys.length) await redis.del(...keys);
  } catch { /* non-fatal */ }
}
