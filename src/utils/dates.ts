export function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}

export function yesterday(): Date {
  return daysAgo(1)
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function splitIntoBatches<T>(arr: T[], size: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size))
  }
  return batches
}
