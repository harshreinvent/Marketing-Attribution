"use client";

import { useExport } from "@/hooks/useExport";

type Props = { data: Record<string, unknown>[]; filename: string };

export function ExportButton({ data, filename }: Props) {
  const { exportToCsv } = useExport();
  return (
    <button
      onClick={() => exportToCsv(data, filename)}
      className="text-sm border rounded px-3 py-1.5 hover:bg-accent"
    >
      Export CSV
    </button>
  );
}
