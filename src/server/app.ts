import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { env } from "@repo/config";
import { router } from "../routes";
import { errorHandler } from "../error/errorHandler";
import { openApiSpec } from "./swagger";

export const app = new Hono();

app.use("*", logger());
app.use("*", cors({ origin: env.FRONTEND_URL, credentials: true }));

// Swagger UI — open http://localhost:3001/docs in your browser
app.get("/docs", swaggerUI({ url: "/openapi.json" }));
app.get("/openapi.json", (c) => c.json(openApiSpec));

app.route("/api", router);
app.onError(errorHandler);
