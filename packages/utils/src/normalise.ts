// [FIX 7] PURE TEXT ONLY — no DB access, no mapSource, no mapLocation
// DB-backed mapping belongs in apps/worker/src/normalise/

export function normaliseText(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normaliseCampaignName(name: string): string {
  return normaliseText(name)
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/\s+/g, "_");
}

export function cleanPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function slugifySource(source: string): string {
  return normaliseText(source)
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
}
