"use client";

import { useFilterStore } from "@/stores/filterStore";
import { DATE_PRESETS } from "@/lib/dates";

export function FilterBar() {
  const { dateRange, setDateRange, selectedLocation, setLocation, reset } = useFilterStore();

  return (
    <div className="border-b bg-card px-6 py-3 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">From</label>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="text-sm border rounded px-2 py-1"
        />
        <label className="text-sm text-muted-foreground">To</label>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          className="text-sm border rounded px-2 py-1"
        />
      </div>
      <div className="flex gap-2">
        {DATE_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setDateRange(p.range)}
            className="text-xs px-2 py-1 border rounded hover:bg-accent"
          >
            {p.label}
          </button>
        ))}
      </div>
      <button onClick={reset} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
        Reset
      </button>
    </div>
  );
}
