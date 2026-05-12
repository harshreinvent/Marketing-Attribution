import { Hono } from "hono";
import { prisma } from "@repo/db";
import { redis } from "@repo/config";

export const healthRouter = new Hono();

healthRouter.get("/", async (c) => {
  const [db, cache] = await Promise.allSettled([
    prisma.$queryRaw`SELECT 1`,
    redis.ping(),
  ]);
  return c.json({
    status: "ok",
    db: db.status === "fulfilled" ? "ok" : "error",
    cache: cache.status === "fulfilled" ? "ok" : "error",
    ts: new Date().toISOString(),
  });
});
