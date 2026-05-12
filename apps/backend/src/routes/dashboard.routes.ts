import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { rateLimitMiddleware } from "../middleware/rateLimit.middleware";
import { executiveSummaryController } from "../controllers/dashboard/executiveSummary.controller";
import { googleAdsController } from "../controllers/dashboard/googleAds.controller";
import { metaAdsController } from "../controllers/dashboard/metaAds.controller";
import { websiteOrganicController } from "../controllers/dashboard/websiteOrganic.controller";
import { funnelRoiController } from "../controllers/dashboard/funnelRoi.controller";
import { gmbController } from "../controllers/dashboard/gmb.controller";
import { syncStatusController } from "../controllers/dashboard/syncStatus.controller";
import type { Session } from "@repo/types";

type Variables = { session: Session };

export const dashboardRouter = new Hono<{ Variables: Variables }>();

dashboardRouter.use("*", authMiddleware);
dashboardRouter.use("*", rbacMiddleware);
dashboardRouter.use("*", rateLimitMiddleware(60));

dashboardRouter.get("/executive-summary", executiveSummaryController);
dashboardRouter.get("/google-ads", googleAdsController);
dashboardRouter.get("/meta-ads", metaAdsController);
dashboardRouter.get("/website-organic", websiteOrganicController);
dashboardRouter.get("/funnel-roi", funnelRoiController);
dashboardRouter.get("/gmb", gmbController);
// [FIX 4] client-scoped sync status — works for all roles
dashboardRouter.get("/sync-status", syncStatusController);
