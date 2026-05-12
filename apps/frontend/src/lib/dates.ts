import { toISODate, daysAgo } from "@repo/utils";

export type DatePreset = {
  label: string;
  range: { from: string; to: string };
};

export const DATE_PRESETS: DatePreset[] = [
  {
    label: "Today",
    range: { from: toISODate(new Date()), to: toISODate(new Date()) },
  },
  {
    label: "Last 7 days",
    range: { from: toISODate(daysAgo(7)), to: toISODate(daysAgo(1)) },
  },
  {
    label: "Last 30 days",
    range: { from: toISODate(daysAgo(30)), to: toISODate(daysAgo(1)) },
  },
  {
    label: "This month",
    range: {
      from: toISODate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      to: toISODate(daysAgo(1)),
    },
  },
];
