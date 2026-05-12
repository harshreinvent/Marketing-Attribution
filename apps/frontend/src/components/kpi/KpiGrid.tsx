import type { KpiCard as KpiCardType } from "@repo/types";
import { KpiCard } from "./KpiCard";

type Props = { kpis: KpiCardType[]; loading?: boolean };

export function KpiGrid({ kpis, loading }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <KpiCard key={i} label="" value={0} format="number" loading />)
        : kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
    </div>
  );
}
