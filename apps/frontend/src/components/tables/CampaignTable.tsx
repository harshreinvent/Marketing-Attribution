"use client";

import type { CampaignRow } from "@repo/types";
import { formatCurrency, formatNumber, formatPercent } from "@repo/utils";
import { ExportButton } from "@/components/common/ExportButton";

type Props = { rows: CampaignRow[] };

export function CampaignTable({ rows }: Props) {
  return (
    <div>
      <div className="flex justify-end mb-2">
        <ExportButton data={rows as unknown as Record<string, unknown>[]} filename="campaigns" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-4">Campaign</th>
              <th className="pb-2 pr-4 text-right">Spend</th>
              <th className="pb-2 pr-4 text-right">Impressions</th>
              <th className="pb-2 pr-4 text-right">Clicks</th>
              <th className="pb-2 pr-4 text-right">CTR</th>
              <th className="pb-2 pr-4 text-right">Leads</th>
              <th className="pb-2 pr-4 text-right">CPL</th>
              <th className="pb-2 text-right">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.campaignName} className="border-b">
                <td className="py-2 pr-4 max-w-48 truncate">{row.campaignName}</td>
                <td className="py-2 pr-4 text-right">{formatCurrency(row.spend)}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.impressions)}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.clicks)}</td>
                <td className="py-2 pr-4 text-right">{formatPercent(row.ctr)}</td>
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
