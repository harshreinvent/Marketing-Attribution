import { env } from "./env";

export function getDatabaseUrl(service: "backend" | "worker"): string {
  const poolParams =
    service === "worker"
      ? "?pgbouncer=true&connection_limit=5"
      : "?pgbouncer=true&connection_limit=10";
  return `${env.DATABASE_URL}${poolParams}`;
}
