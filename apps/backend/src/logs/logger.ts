import pino from "pino";
import { env } from "@repo/config";

export const logger = pino(
  env.NODE_ENV === "development"
    ? { transport: { target: "pino-pretty" } }
    : {}
);
