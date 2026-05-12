import { create } from "zustand";
import { toISODate, daysAgo } from "@repo/utils";

type DateRange = { from: string; to: string };

type FilterStore = {
  dateRange: DateRange;
  selectedLocation?: string;
  selectedSource?: string;
  selectedCampaign?: string;
  activeClientId?: string;
  setDateRange: (range: DateRange) => void;
  setLocation: (locationId: string | undefined) => void;
  setSource: (source: string | undefined) => void;
  setCampaign: (campaign: string | undefined) => void;
  setActiveClient: (clientId: string | undefined) => void;
  reset: () => void;
};

const DEFAULT_DATE_RANGE: DateRange = {
  from: toISODate(daysAgo(30)),
  to: toISODate(daysAgo(1)),
};

export const useFilterStore = create<FilterStore>((set) => ({
  dateRange: DEFAULT_DATE_RANGE,
  selectedLocation: undefined,
  selectedSource: undefined,
  selectedCampaign: undefined,
  activeClientId: undefined,
  setDateRange: (range) => set({ dateRange: range }),
  setLocation: (locationId) => set({ selectedLocation: locationId }),
  setSource: (source) => set({ selectedSource: source }),
  setCampaign: (campaign) => set({ selectedCampaign: campaign }),
  setActiveClient: (clientId) => set({ activeClientId: clientId }),
  reset: () => set({ dateRange: DEFAULT_DATE_RANGE, selectedLocation: undefined, selectedSource: undefined, selectedCampaign: undefined }),
}));
