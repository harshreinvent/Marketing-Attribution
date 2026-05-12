import type { Context } from "hono";
import type { Session } from "@repo/types";
import { syncStatusService } from "../../services/syncStatus.service";

type Variables = { session: Session };

export async function syncStatusController(c: Context<{ Variables: Variables }>) {
  const session = c.get("session");
  return c.json(await syncStatusService.getForClient(session.clientId));
}
