import { z } from "zod";

export const ga4DimensionValueSchema = z.object({
  value: z.string(),
});

export const ga4MetricValueSchema = z.object({
  value: z.string(),
});

export const ga4RowSchema = z.object({
  dimensionValues: z.array(ga4DimensionValueSchema),
  metricValues: z.array(ga4MetricValueSchema),
});

export const ga4ResponseSchema = z.object({
  dimensionHeaders: z.array(z.object({ name: z.string() })),
  metricHeaders: z.array(z.object({ name: z.string(), type: z.string() })),
  rows: z.array(ga4RowSchema).optional(),
  rowCount: z.number().optional(),
});

export type Ga4Response = z.infer<typeof ga4ResponseSchema>;
