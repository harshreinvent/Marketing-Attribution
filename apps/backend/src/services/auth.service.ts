import { createRemoteJWKSet, jwtVerify } from "jose";
import { prisma } from "@repo/db";
import { redis } from "@repo/config";
import { env } from "@repo/config";
import { UserRole } from "@repo/types";
import type { Session } from "@repo/types";
import { AuthError } from "../error/errors";

// Supabase public keys — fetched once at startup, jose caches them automatically.
// No HTTP call is made on subsequent verifications.
const JWKS = createRemoteJWKSet(
  new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

export const authService = {
  async verifyJWT(token: string): Promise<Session> {
    // Step 1: Verify signature locally using Supabase's public key.
    // Checks ES256 signature + expiry. No HTTP call to Supabase.
    let payload: Awaited<ReturnType<typeof jwtVerify>>["payload"];
    try {
      const result = await jwtVerify(token, JWKS);
      payload = result.payload;
    } catch {
      throw new AuthError("Invalid or expired token");
    }

    const supabaseId = payload.sub;
    const sessionId = payload["session_id"] as string | undefined;

    if (!supabaseId) throw new AuthError("Invalid token");

    // Step 2: Check Redis banned list (tokens invalidated by logout).
    // If Redis is down, fail open — a logged-out token is at worst valid
    // for its remaining lifetime (max 1 hour).
    if (sessionId) {
      try {
        const revoked = await redis.get(`revoked:${sessionId}`);
        if (revoked) throw new AuthError("Token has been revoked");
      } catch (e) {
        if (e instanceof AuthError) throw e;
        console.warn("[auth] Redis unavailable — skipping revocation check");
      }
    }

    // Step 3: Read role, clientId, locationIds from DB.
    // The JWT only proves identity. The database determines what the user can do.
    const user = await prisma.user.findUnique({
      where: { supabase_id: supabaseId },
      include: { user_location_access: true },
    });

    if (!user) throw new AuthError("User not found");

    return {
      userId: supabaseId,
      clientId: user.client_id,
      role: user.role as unknown as UserRole,
      locationIds: user.user_location_access.map((a) => a.location_id),
    };
  },
};
