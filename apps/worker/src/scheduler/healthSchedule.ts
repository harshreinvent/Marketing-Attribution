import cron from "node-cron";
import { staleSyncAlert } from "../health-check/staleSyncAlert";
import { tokenExpiryAlert } from "../health-check/tokenExpiryAlert";
import { rlsMonitor } from "../health-check/rlsMonitor";

export const healthSchedule = cron.schedule(
  "0 6 * * *",
  async () => {
    await Promise.allSettled([staleSyncAlert(), tokenExpiryAlert(), rlsMonitor()]);
  },
  { scheduled: false }
);
