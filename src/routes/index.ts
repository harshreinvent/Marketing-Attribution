import { Hono } from "hono";
import { authRouter } from "./auth.routes";
import { dashboardRouter } from "./dashboard.routes";
import { adminRouter } from "./admin.routes";
import { healthRouter } from "./health.routes";

export const router = new Hono();

router.route("/auth", authRouter);
router.route("/dashboard", dashboardRouter);
router.route("/admin", adminRouter);
router.route("/health", healthRouter);
