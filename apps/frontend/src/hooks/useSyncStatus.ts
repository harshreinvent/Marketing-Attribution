import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useFilterStore } from "@/stores/filterStore";

// [FIX 4] Calls /api/dashboard/sync-status — scoped to the active client, works for all roles
export function useSyncStatus() {
  const activeClientId = useFilterStore((s) => s.activeClientId);

  return useQuery({
    queryKey: ["sync-status", activeClientId],
    queryFn: () => api.syncStatus(activeClientId),
    refetchInterval: 5 * 60 * 1000,
  });
}
