import { z } from "zod";

export const dashboardFilterSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  location_id: z.string().optional(),
  source: z.string().optional(),
  campaign: z.string().optional(),
  client_id: z.string().optional(),
});

export type DashboardFilterInput = z.infer<typeof dashboardFilterSchema>;
