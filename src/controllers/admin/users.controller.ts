import type { Context } from "hono";
import { z } from "zod";
import { prisma } from "@repo/db";
import { supabaseAdmin } from "@repo/config";
import { UserRole } from "@repo/types";
import { ValidationError } from "../../error/errors";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["AGENCY_ADMIN", "CLIENT_ADMIN"]),
  clientId: z.string().optional(),
});

export const usersController = {
  async list(c: Context) {
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        client_id: true,
        client: { select: { name: true } },
        created_at: true,
      },
    });
    return c.json(users);
  },

  async create(c: Context) {
    const body = await c.req.json().catch(() => null);
    const result = createUserSchema.safeParse(body);
    if (!result.success) throw new ValidationError(result.error.errors[0].message);

    const { email, password, role, clientId } = result.data;

    if (role === "CLIENT_ADMIN" && !clientId) {
      throw new ValidationError("clientId is required for CLIENT_ADMIN");
    }
    if (role === "AGENCY_ADMIN" && clientId) {
      throw new ValidationError("AGENCY_ADMIN cannot be assigned to a client");
    }

    // Step 1: create Supabase Auth user (email already confirmed — no verification email)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) {
      throw new ValidationError(error?.message ?? "Failed to create auth user");
    }

    const supabaseId = data.user.id;

    // Step 2: create Prisma user; roll back Supabase user on failure
    let user;
    try {
      user = await prisma.user.create({
        data: {
          supabase_id: supabaseId,
          email,
          role: role as unknown as UserRole,
          client_id: clientId ?? null,
        },
        select: {
          id: true,
          email: true,
          role: true,
          client_id: true,
          created_at: true,
        },
      });
    } catch (e) {
      await supabaseAdmin.auth.admin.deleteUser(supabaseId).catch(() => {});
      throw e;
    }

    return c.json(user, 201);
  },
};
