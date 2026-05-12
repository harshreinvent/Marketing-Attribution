import type { Context } from "hono";
export const clientsController = {
  async list(c: Context) { return c.json([]); },
  async create(c: Context) { return c.json({}, 201); },
};
