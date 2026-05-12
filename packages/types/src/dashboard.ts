export type KpiCard = {
  label: string;
  value: number | string;
  delta?: number;
  deltaLabel?: string;
  format: "currency" | "number" | "percent";
};

export type ChartData = {
  date: string;
  [key: string]: number | string;
};

export type FilterState = {
  dateRange: { from: string; to: string };
  selectedLocation?: string;
  selectedSource?: string;
  selectedCampaign?: string;
  activeClientId?: string;
};
