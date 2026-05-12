import type { Session } from "@repo/types";

declare module "hono" {
  interface ContextVariableMap {
    session: Session;
  }
}
