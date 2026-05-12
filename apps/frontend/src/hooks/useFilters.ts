import { useFilterStore } from "@/stores/filterStore";

// [CRITICAL] Single source of truth for all dashboard filter params + React Query key.
// ALL components must use this hook — never read filterStore directly in query calls.
export function useFilters() {
  const { dateRange, selectedLocation, selectedSource, selectedCampaign, activeClientId } =
    useFilterStore();

  const params = {
    start_date: dateRange.from,
    end_date: dateRange.to,
    ...(selectedLocation ? { location_id: selectedLocation } : {}),
    ...(selectedSource ? { source: selectedSource } : {}),
    ...(selectedCampaign ? { campaign: selectedCampaign } : {}),
    ...(activeClientId ? { client_id: activeClientId } : {}),
  };

  const queryKey = [
    dateRange.from,
    dateRange.to,
    selectedLocation,
    selectedSource,
    selectedCampaign,
    activeClientId,
  ];

  return { params, queryKey };
}
