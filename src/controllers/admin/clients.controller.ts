import type { Context } from "hono";
import { z } from "zod";
import { prisma } from "@repo/db";
import { ValidationError } from "../../error/errors";

const createClientSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
});

export const clientsController = {
  async list(c: Context) {
    const clients = await prisma.client.findMany({
      orderBy: { created_at: "desc" },
      select: { id: true, name: true, slug: true, is_data_initialized: true, created_at: true },
    });
    return c.json(clients);
  },

  async create(c: Context) {
    const body = await c.req.json().catch(() => null);
    const result = createClientSchema.safeParse(body);
    if (!result.success) throw new ValidationError(result.error.errors[0].message);

    const { name, slug } = result.data;

    const existing = await prisma.client.findUnique({ where: { slug } });
    if (existing) throw new ValidationError(`Slug "${slug}" is already taken`);

    const client = await prisma.client.create({
      data: { name, slug },
      select: { id: true, name: true, slug: true, created_at: true },
    });

    return c.json(client, 201);
  },
};
