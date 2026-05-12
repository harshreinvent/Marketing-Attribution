import { syncSchedule } from "./scheduler/syncSchedule";
import { healthSchedule } from "./scheduler/healthSchedule";
import { syncWorker } from "./queue/syncWorker";

syncSchedule.start();
healthSchedule.start();
syncWorker.run();

console.log("Worker started — sync: 2 AM, health: 6 AM");
