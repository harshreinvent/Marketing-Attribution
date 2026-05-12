import { logger } from "./logger";

export const syncLogger = logger.child({ service: "sync-worker" });
