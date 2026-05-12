import type { MiddlewareHandler } from "hono";
import { authService } from "../services/auth.service";
import { AuthError } from "../error/errors";
import type { Session } from "@repo/types";

type Variables = { session: Session };

export const authMiddleware: MiddlewareHandler<{ Variables: Variables }> = async (c, next) => {
  const authorization = c.req.header("Authorization");
  if (!authorization?.startsWith("Bearer ")) throw new AuthError("Missing token");

  const token = authorization.slice(7);
  const session = await authService.verifyJWT(token);
  c.set("session", session);
  await next();
};
