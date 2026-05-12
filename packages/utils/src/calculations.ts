export function calculateCPL(spend: number, leads: number): number | null {
  if (leads === 0) return null;
  return spend / leads;
}

export function calculateROAS(revenue: number, spend: number): number | null {
  if (spend === 0) return null;
  return revenue / spend;
}

export function calculateROI(revenue: number, spend: number): number | null {
  if (spend === 0) return null;
  return (revenue - spend) / spend;
}

export function calculateBookingRate(appointments: number, leads: number): number | null {
  if (leads === 0) return null;
  return appointments / leads;
}
