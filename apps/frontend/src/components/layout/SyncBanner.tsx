"use client";

import { useSyncStatus } from "@/hooks/useSyncStatus";

// [FIX 4] Calls /api/dashboard/sync-status — works for ALL roles, not just agency admin
export function SyncBanner() {
  const { data } = useSyncStatus();

  if (!data?.lastSuccessfulSyncAt) return null;

  const syncedAt = new Date(data.lastSuccessfulSyncAt);
  const label = syncedAt.toLocaleDateString("en-IN", {
    dateStyle: "medium",
  });
  const time = syncedAt.toLocaleTimeString("en-IN", { timeStyle: "short" });

  return (
    <div className="bg-muted/50 border-b px-6 py-1.5 text-xs text-muted-foreground">
      Data updated: {label} {time}
    </div>
  );
}
