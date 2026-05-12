import type { MiddlewareHandler } from "hono";
import { logger } from "./logger";
import type { Session } from "@repo/types";

type Variables = { session?: Session };

export const requestLogger: MiddlewareHandler<{ Variables: Variables }> = async (c, next) => {
  const start = Date.now();
  await next();
  logger.info({
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    clientId: c.get("session")?.clientId,
    durationMs: Date.now() - start,
  });
};
