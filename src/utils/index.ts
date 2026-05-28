// ─── Date utilities ───────────────────────────────────────────────────

export const daysAgo = (n: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}

export const toISODate = (date: Date): string =>
  date.toISOString().split('T')[0]

// ─── Metric calculations ──────────────────────────────────────────────

export const calculateCPL = (spend: number, leads: number): number | null =>
  leads === 0 ? null : spend / leads

export const calculateROAS = (revenue: number, spend: number): number | null =>
  spend === 0 ? null : revenue / spend

export const calculateROI = (revenue: number, spend: number): number | null =>
  spend === 0 ? null : (revenue - spend) / spend

export const calculateBookingRate = (appointments: number, leads: number): number | null =>
  leads === 0 ? null : appointments / leads

// ─── Date presets ─────────────────────────────────────────────────────

export const DATE_PRESETS = [
  { label: 'Today',       range: { startDate: toISODate(new Date()),    endDate: toISODate(new Date()) } },
  { label: 'Last 7 days', range: { startDate: toISODate(daysAgo(7)),    endDate: toISODate(daysAgo(1)) } },
  { label: 'Last 30 days',range: { startDate: toISODate(daysAgo(30)),   endDate: toISODate(daysAgo(1)) } },
  { label: 'Last 90 days',range: { startDate: toISODate(daysAgo(90)),   endDate: toISODate(daysAgo(1)) } },
  {
    label: 'This month',
    range: {
      startDate: toISODate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      endDate: toISODate(daysAgo(1)),
    },
  },
]
