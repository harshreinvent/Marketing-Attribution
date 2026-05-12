import type { Context } from "hono";
export const mappingsController = {
  async list(c: Context) { return c.json([]); },
  async upsert(c: Context) { return c.json({}, 201); },
};
