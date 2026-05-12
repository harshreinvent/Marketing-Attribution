import type { Context } from "hono";
import { syncStatusService } from "../../services/syncStatus.service";
export async function syncStatusController(c: Context) {
  return c.json(await syncStatusService.getAll());
}
