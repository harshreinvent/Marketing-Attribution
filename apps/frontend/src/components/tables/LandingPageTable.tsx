"use client";

import type { LandingPageRow } from "@repo/types";
import { formatNumber, formatPercent } from "@repo/utils";
import { ExportButton } from "@/components/common/ExportButton";

type Props = { rows: LandingPageRow[] };

export function LandingPageTable({ rows }: Props) {
  return (
    <div>
      <div className="flex justify-end mb-2">
        <ExportButton data={rows as unknown as Record<string, unknown>[]} filename="landing-pages" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-4">Page</th>
              <th className="pb-2 pr-4 text-right">Sessions</th>
              <th className="pb-2 pr-4 text-right">Users</th>
              <th className="pb-2 pr-4 text-right">Page Views</th>
              <th className="pb-2 text-right">Bounce Rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.page} className="border-b">
                <td className="py-2 pr-4 max-w-64 truncate text-xs">{row.page}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.sessions)}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.users)}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.pageViews)}</td>
                <td className="py-2 text-right">
                  {row.bounceRate != null ? formatPercent(row.bounceRate) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
