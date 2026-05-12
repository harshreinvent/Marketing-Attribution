import { z } from "zod";

export const gmbMetricValueSchema = z.object({
  metricOption: z.string(),
  value: z.object({
    metric: z.string(),
    totalValue: z.object({
      value: z.string().optional(),
    }),
  }),
});

export const gmbLocationMetricsSchema = z.object({
  locationName: z.string(),
  timeZone: z.string().optional(),
  metricValues: z.array(gmbMetricValueSchema),
});

export const gmbResponseSchema = z.object({
  locationMetrics: z.array(gmbLocationMetricsSchema).optional(),
});

export type GmbResponse = z.infer<typeof gmbResponseSchema>;
