import { Worker } from "bullmq";
import { redis } from "@repo/config";
import { processor } from "./processor";
import type { SyncJob } from "@repo/types";

export const syncWorker = {
  run() {
    return new Worker<SyncJob>("sync", async (job) => processor(job.data), {
      connection: redis,
      concurrency: 1,
    });
  },
};
