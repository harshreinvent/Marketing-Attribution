import type { Context } from "hono";
export const locationsController = {
  async list(c: Context) { return c.json([]); },
  async create(c: Context) { return c.json({}, 201); },
};
