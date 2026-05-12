import type { MiddlewareHandler } from "hono";
import { UserRole } from "@repo/types";
import { RBACError } from "../error/errors";
import type { Session } from "@repo/types";

type Variables = { session: Session };

export const agencyAdminMiddleware: MiddlewareHandler<{ Variables: Variables }> = async (c, next) => {
  const session = c.get("session");
  if (session.role !== UserRole.AGENCY_ADMIN) throw new RBACError("Agency admin access required");
  await next();
};
