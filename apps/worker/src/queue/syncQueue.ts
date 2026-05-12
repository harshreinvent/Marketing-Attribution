import { Queue } from "bullmq";
import { redis } from "@repo/config";
import type { SyncJob } from "@repo/types";

export const syncQueue = new Queue<SyncJob>("sync", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});
