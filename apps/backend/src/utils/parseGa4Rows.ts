export interface Ga4Row {
  dimensions: Record<string, string>;
  metrics:    Record<string, number>;
}

// GA4 returns "(not set)" or empty string for unknown dimensions.
// Postgres treats NULL != NULL in unique constraints, so two rows with
// NULL campaign can't upsert — they silently create duplicates.
// Always normalise to "not_set" so upserts work correctly.
export function cleanDimension(value?: string | null): string {
  if (!value || value.trim() === "" || value === "(not set)" || value === "(none)") {
    return "not_set";
  }
  return value.trim();
}

export function parseGa4Rows(
  rows: any[],
  dimensionHeaders: string[],
  metricHeaders: string[]
): Ga4Row[] {
  return (rows || []).map((row) => {
    const dimensions: Record<string, string> = {};
    const metrics:    Record<string, number>  = {};

    (row.dimensionValues || []).forEach((d: any, i: number) => {
      dimensions[dimensionHeaders[i]] = d.value ?? "";
    });
    (row.metricValues || []).forEach((m: any, i: number) => {
      metrics[metricHeaders[i]] = parseFloat(m.value ?? "0") || 0;
    });

    return { dimensions, metrics };
  });
}

export function parseGa4Date(raw: string): Date {
  // GA4 returns dates as "20260501" → convert to "2026-05-01"
  return new Date(raw.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"));
}
