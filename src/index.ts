import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./server/app";
import { env } from "@repo/config";

serve({ fetch: app.fetch, port: parseInt(env.PORT) }, (info) => {
  console.log(`Backend listening on http://localhost:${info.port}`);
  console.log(`Swagger UI:        http://localhost:${info.port}/docs`);
});
