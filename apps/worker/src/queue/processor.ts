import type { SyncJob } from "@repo/types";
import { checkFlag } from "../steps/1-checkFlag";
import { syncGoogleAds } from "../steps/2-syncGoogleAds";
import { syncMetaAds } from "../steps/3-syncMetaAds";
import { syncGA4 } from "../steps/4-syncGA4";
import { syncGMB } from "../steps/5-syncGMB";
import { syncCRM } from "../steps/6-syncCRM";
import { invalidateCache } from "../steps/7-invalidateCache";
import { updateTimestamps } from "../steps/8-updateTimestamps";
import { syncLogger } from "../logs/syncLogger";

export async function processor(job: SyncJob) {
  const { clientId } = job;
  syncLogger.info({ clientId, step: "start" });

  const { dateRange, isFirstRun } = await checkFlag(clientId);

  await syncGoogleAds(clientId, dateRange);
  await syncMetaAds(clientId, dateRange);
  await syncGA4(clientId, dateRange);
  await syncGMB(clientId, dateRange);
  await syncCRM(clientId, dateRange);
  await invalidateCache(clientId);
  await updateTimestamps(clientId, isFirstRun);

  syncLogger.info({ clientId, step: "complete" });
}
