"use client";

import type { LocationRow } from "@repo/types";
import { formatCurrency, formatNumber, formatPercent } from "@repo/utils";
import { ExportButton } from "@/components/common/ExportButton";

type Props = { rows: LocationRow[] };

export function LocationTable({ rows }: Props) {
  return (
    <div>
      <div className="flex justify-end mb-2">
        <ExportButton data={rows as unknown as Record<string, unknown>[]} filename="locations" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-4">Location</th>
              <th className="pb-2 pr-4 text-right">Spend</th>
              <th className="pb-2 pr-4 text-right">Leads</th>
              <th className="pb-2 pr-4 text-right">CPL</th>
              <th className="pb-2 text-right">Booking Rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.locationName} className="border-b">
                <td className="py-2 pr-4">{row.locationName}</td>
                <td className="py-2 pr-4 text-right">{formatCurrency(row.spend)}</td>
                <td className="py-2 pr-4 text-right">{formatNumber(row.leads)}</td>
                <td className="py-2 pr-4 text-right">{formatCurrency(row.cpl)}</td>
                <td className="py-2 text-right">
                  {row.bookingRate != null ? formatPercent(row.bookingRate) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
