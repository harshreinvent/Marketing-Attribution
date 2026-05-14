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
  crmToken:      z.string().optional(),
  crmLocationId: z.string().optional(),
}).refine(
  (d) => !(d.crmToken && !d.crmLocationId) && !(!d.crmToken && d.crmLocationId),
  { message: "crmToken and crmLocationId must both be provided together" }
);

export const clientsController = {
  async list(c: Context) {
    const clients = await prisma.client.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        is_data_initialized: true,
        crm_last_sync_at: true,
        created_at: true,
        integrations: { select: { platform: true } },
      },
    });
    return c.json(clients);
  },

  async create(c: Context) {
    const body = await c.req.json().catch(() => null);
    const result = createClientSchema.safeParse(body);
    if (!result.success) throw new ValidationError(result.error.errors[0].message);

    const { name, slug, crmToken, crmLocationId } = result.data;

    const existing = await prisma.client.findUnique({ where: { slug } });
    if (existing) throw new ValidationError(`Slug "${slug}" is already taken`);

    const client = await prisma.client.create({
      data: {
        name,
        slug,
        ...(crmToken && crmLocationId
          ? {
              integrations: {
                create: {
                  platform: "CRM",
                  credentials: { api_key: crmToken, location_id: crmLocationId },
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        created_at: true,
        integrations: { select: { platform: true } },
      },
    });

    return c.json(client, 201);
  },
};
