import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middleware";
import { agencyAdminMiddleware } from "../middleware/agencyAdmin.middleware";
import { rateLimitMiddleware } from "../middleware/rateLimit.middleware";
import { clientsController } from "../controllers/admin/clients.controller";
import { usersController } from "../controllers/admin/users.controller";
import { integrationsController } from "../controllers/admin/integrations.controller";
import { mappingsController } from "../controllers/admin/mappings.controller";
import { syncStatusController as adminSyncStatusController } from "../controllers/admin/syncStatus.controller";
import type { Session } from "@repo/types";

type Variables = { session: Session };

export const adminRouter = new Hono<{ Variables: Variables }>();

adminRouter.use("*", authMiddleware);
adminRouter.use("*", agencyAdminMiddleware);
adminRouter.use("*", rateLimitMiddleware(20));

adminRouter.get("/clients", clientsController.list);
adminRouter.post("/clients", clientsController.create);
adminRouter.get("/users", usersController.list);
adminRouter.post("/users", usersController.create);
adminRouter.get("/integrations", integrationsController.list);   // [FIX 5]
adminRouter.post("/integrations", integrationsController.upsert); // [FIX 5]
adminRouter.get("/mappings", mappingsController.list);             // [FIX 5]
adminRouter.post("/mappings", mappingsController.upsert);          // [FIX 5]
adminRouter.get("/sync-status", adminSyncStatusController);
