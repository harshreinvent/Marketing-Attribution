import { prisma } from "@repo/db";
import type { Session } from "@repo/types";
import { UserRole } from "@repo/types";
import type { TenantScope } from "@repo/db";
import { RBACError, NotFoundError } from "../error/errors";

// [FIX 3] Resolves the correct TenantScope for every role
export async function resolveAccessScope(
  session: Session,
  requestedClientId?: string
): Promise<TenantScope> {
  if (session.role === UserRole.AGENCY_ADMIN) {
    if (!requestedClientId) {
      return { clientId: session.clientId, role: "AGENCY_ADMIN" };
    }
    const client = await prisma.client.findUnique({ where: { id: requestedClientId } });
    if (!client) throw new NotFoundError("Client not found");
    return { clientId: requestedClientId, role: "AGENCY_ADMIN" };
  }

  if (session.role === UserRole.LOCATION_MANAGER) {
    return {
      clientId: session.clientId,
      locationIds: session.locationIds,
      role: "LOCATION_MANAGER",
    };
  }

  return {
    clientId: session.clientId,
    role: session.role as TenantScope["role"],
  };
}
