import type { KpiCard as KpiCardType } from "@repo/types";
import { formatCurrency, formatNumber, formatPercent } from "@repo/utils";

type Props = KpiCardType & { loading?: boolean };

export function KpiCard({ label, value, delta, deltaLabel, format, loading }: Props) {
  if (loading) {
    return <div className="h-24 bg-muted animate-pulse rounded-lg" />;
  }

  const formatted =
    format === "currency"
      ? formatCurrency(typeof value === "number" ? value : null)
      : format === "percent"
      ? formatPercent(typeof value === "number" ? value : null)
      : formatNumber(typeof value === "number" ? value : null);

  return (
    <div className="bg-card border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1">{formatted}</p>
      {delta !== undefined && (
        <p className={`text-xs mt-1 ${delta >= 0 ? "text-green-600" : "text-red-500"}`}>
          {delta >= 0 ? "+" : ""}
          {formatPercent(delta)} {deltaLabel ?? "vs prev period"}
        </p>
      )}
    </div>
  );
}
