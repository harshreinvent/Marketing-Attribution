import type { Context } from "hono";
import type { Session } from "@repo/types";

type Variables = { session: Session };

export async function executiveSummaryController(c: Context<{ Variables: Variables }>) {
  return c.json({});
}
