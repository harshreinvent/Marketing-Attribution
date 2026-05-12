"use client";

import type { FunnelSourceRow } from "@repo/types";
import { formatCurrency, formatNumber, formatPercent } from "@repo/utils";
import { ExportButton } from "@/components/common/ExportButton";

type Props = { rows: FunnelSourceRow[] };

export function FunnelSourceTable({ rows }: Props) {
  return (
    <div>
      <div className="flex justify-end mb-2">
        <ExportButton data={rows as unknown as Record<string, unknown>[]} filename="funnel-by-source" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-4">Source</th>
              <th className="pb-2 pr-4 text-right">Leads</th>
              <th className="pb-2 pr-4 text-right">Appointments</th>
              <th className="pb-2 pr-4 text-right">Closed</th>
              <th className="pb-2 pr-4 text-right">Revenue</th>
              <th className="pb-2 text-right">ROI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.source} className="border-b">
                <td className="py-2 pr-4">{row.source}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.leads)}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.appointments)}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.closed)}</td>
                <td className="py-2 pr-4 text-right">{formatCurrency(row.revenue)}</td>
                <td className="py-2 text-right">{formatPercent(row.roi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
