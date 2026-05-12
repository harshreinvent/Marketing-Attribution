import { supabase } from "./supabase";
import type { DashboardFilterInput } from "@repo/validators";
import type {
  ExecutiveSummaryResponse,
  GoogleAdsResponse,
  MetaAdsResponse,
  WebsiteOrganicResponse,
  FunnelRoiResponse,
  GmbResponse,
  SyncStatusResponse,
} from "@repo/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function authFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const url = new URL(`${BASE_URL}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw Object.assign(new Error(await res.text()), { status: res.status });
  return res.json() as Promise<T>;
}

function filtersToParams(f: DashboardFilterInput): Record<string, string> {
  const p: Record<string, string> = { start_date: f.start_date, end_date: f.end_date };
  if (f.location_id) p.location_id = f.location_id;
  if (f.source) p.source = f.source;
  if (f.campaign) p.campaign = f.campaign;
  if (f.client_id) p.client_id = f.client_id;
  return p;
}

export const api = {
  executiveSummary: (f: DashboardFilterInput) =>
    authFetch<ExecutiveSummaryResponse>("/api/dashboard/executive-summary", filtersToParams(f)),
  googleAds: (f: DashboardFilterInput) =>
    authFetch<GoogleAdsResponse>("/api/dashboard/google-ads", filtersToParams(f)),
  metaAds: (f: DashboardFilterInput) =>
    authFetch<MetaAdsResponse>("/api/dashboard/meta-ads", filtersToParams(f)),
  websiteOrganic: (f: DashboardFilterInput) =>
    authFetch<WebsiteOrganicResponse>("/api/dashboard/website-organic", filtersToParams(f)),
  funnelRoi: (f: DashboardFilterInput) =>
    authFetch<FunnelRoiResponse>("/api/dashboard/funnel-roi", filtersToParams(f)),
  gmb: (f: DashboardFilterInput) =>
    authFetch<GmbResponse>("/api/dashboard/gmb", filtersToParams(f)),
  syncStatus: (clientId?: string) =>
    authFetch<SyncStatusResponse>("/api/dashboard/sync-status", clientId ? { client_id: clientId } : {}),
};
