import type { MiddlewareHandler } from "hono";
import { redis } from "@repo/config";
import { RBACError } from "../error/errors";
import type { Session } from "@repo/types";

type Variables = { session: Session };

export function rateLimitMiddleware(limitPerMinute: number): MiddlewareHandler<{ Variables: Variables }> {
  return async (c, next) => {
    const session = c.get("session");
    const key = `rate:${session.userId}:${Math.floor(Date.now() / 60_000)}`;

    try {
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, 60);
      if (count > limitPerMinute) throw new RBACError("Rate limit exceeded");
    } catch (e) {
      if (e instanceof RBACError) throw e;
      // Redis down — fail open
    }

    await next();
  };
}
