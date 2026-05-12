import type { MiddlewareHandler } from "hono";
import { resolveAccessScope } from "../services/accessScope.service";
import type { Session } from "@repo/types";

type Variables = { session: Session };

// [CRITICAL] Reads clientId from session, resolves correct TenantScope for all roles
export const rbacMiddleware: MiddlewareHandler<{ Variables: Variables }> = async (c, next) => {
  const session = c.get("session");
  const requestedClientId = c.req.query("client_id");
  const scope = await resolveAccessScope(session, requestedClientId);
  c.set("session", { ...session, clientId: scope.clientId, locationIds: scope.locationIds ?? [] });
  await next();
};
