import { Hono } from "hono";
import { z } from "zod";
import { decodeJwt } from "jose";
import { supabaseAdmin } from "@repo/config";
import { redis } from "@repo/config";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthError, ValidationError } from "../error/errors";

export const authRouter = new Hono();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/login
// Returns a JWT. Paste the access_token into Swagger's Authorize dialog.
// User creation is handled by POST /api/admin/users (agency admin only).
authRouter.post("/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  const result = loginSchema.safeParse(body);
  if (!result.success) throw new ValidationError(result.error.errors[0].message);

  const { email, password } = result.data;

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

  if (error || !data.session) throw new AuthError(error?.message ?? "Invalid credentials");

  return c.json({
    access_token: data.session.access_token,
    token_type: "Bearer",
    expires_in: data.session.expires_in,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
});

// GET /api/auth/me
// Returns the session decoded from the DB — role and clientId come from
// the users table, not from the JWT payload.
authRouter.get("/me", authMiddleware, (c) => {
  return c.json(c.get("session"));
});

// POST /api/auth/logout
// Writes the session_id to the Redis banned list so the token is immediately
// rejected on all future requests, even before it naturally expires.
authRouter.post("/logout", authMiddleware, async (c) => {
  const token = c.req.header("Authorization")!.slice(7);

  try {
    const payload = decodeJwt(token);
    const sessionId = payload["session_id"] as string | undefined;
    const exp = payload.exp;

    if (sessionId && exp) {
      const ttl = Math.max(1, exp - Math.floor(Date.now() / 1000));
      await redis.set(`revoked:${sessionId}`, "1", { ex: ttl });
    }
  } catch {
    console.warn("[auth] Could not write to Redis banned list on logout");
  }

  // Also invalidate in Supabase so refresh tokens stop working too
  await supabaseAdmin.auth.admin.signOut(token);

  return c.json({ message: "Logged out successfully" });
});
