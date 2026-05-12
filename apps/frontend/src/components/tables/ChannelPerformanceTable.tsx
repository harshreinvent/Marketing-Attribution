"use client";

import type { ChannelRow } from "@repo/types";
import { formatCurrency, formatNumber } from "@repo/utils";
import { ExportButton } from "@/components/common/ExportButton";
import { CHANNEL_LABELS } from "@/constants/channels";

type Props = { rows: ChannelRow[] };

export function ChannelPerformanceTable({ rows }: Props) {
  return (
    <div>
      <div className="flex justify-end mb-2">
        <ExportButton data={rows as unknown as Record<string, unknown>[]} filename="channel-performance" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-4">Channel</th>
              <th className="pb-2 pr-4 text-right">Spend</th>
              <th className="pb-2 pr-4 text-right">Leads</th>
              <th className="pb-2 pr-4 text-right">CPL</th>
              <th className="pb-2 text-right">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.channel} className="border-b">
                <td className="py-2 pr-4">{CHANNEL_LABELS[row.channel] ?? row.channel}</td>
                <td className="py-2 pr-4 text-right">{formatCurrency(row.spend)}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.leads)}</td>
                <td className="py-2 pr-4 text-right">{formatCurrency(row.cpl)}</td>
                <td className="py-2 text-right">{row.roas?.toFixed(2) ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
