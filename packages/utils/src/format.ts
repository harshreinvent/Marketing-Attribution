export function formatCurrency(value: number | null, currency = "INR"): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatPercent(value: number | null, decimals = 1): string {
  if (value === null) return "—";
  return `${(value * 100).toFixed(decimals)}%`;
}
