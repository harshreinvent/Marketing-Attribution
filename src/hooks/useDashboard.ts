'use client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { dashboardApi, clientsApi, syncApi } from '@/lib/endpoints'
import { getDefaultDateRange } from '@/lib/utils'
import type { DateRange } from '@/types'

// ─── Query Keys ──────────────────────────────────────────────────────
// Centralized so cache invalidation is consistent
export const QUERY_KEYS = {
  capabilities:  (clientId: string) => ['capabilities', clientId],
  executive:     (clientId: string, dr: DateRange) => ['executive', clientId, dr.startDate, dr.endDate],
  googleAds:     (clientId: string, dr: DateRange) => ['google-ads', clientId, dr.startDate, dr.endDate],
  metaAds:       (clientId: string, dr: DateRange) => ['meta-ads', clientId, dr.startDate, dr.endDate],
  website:       (clientId: string, dr: DateRange, locationId?: string) => ['website', clientId, dr.startDate, dr.endDate, locationId],
  funnelRoi:     (clientId: string, dr: DateRange) => ['funnel-roi', clientId, dr.startDate, dr.endDate],
  gbp:           (clientId: string, dr: DateRange) => ['gbp', clientId, dr.startDate, dr.endDate],
  clients:       () => ['clients'],
  syncLogs:      (clientId: string) => ['sync-logs', clientId],
}

// ─── Capabilities ─────────────────────────────────────────────────────
// Fetched once per client — drives which tabs are shown
export const useCapabilities = (clientId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.capabilities(clientId),
    queryFn: () => clientsApi.getCapabilities(clientId),
    enabled: !!clientId,
    staleTime: 0
  })

// ─── Dashboard tabs ───────────────────────────────────────────────────
// Each hook maps to one dashboard tab
// Data auto-refetches when dateRange or clientId changes

export const useExecutiveSummary = (clientId: string, dateRange: DateRange) =>
  useQuery({
    queryKey: QUERY_KEYS.executive(clientId, dateRange),
    queryFn: () => dashboardApi.executive(clientId, dateRange.startDate, dateRange.endDate),
    enabled: !!clientId,
  })

export const useGoogleAds = (clientId: string, dateRange: DateRange) =>
  useQuery({
    queryKey: QUERY_KEYS.googleAds(clientId, dateRange),
    queryFn: () => dashboardApi.googleAds(clientId, dateRange.startDate, dateRange.endDate),
    enabled: !!clientId,
  })

export const useMetaAds = (clientId: string, dateRange: DateRange) =>
  useQuery({
    queryKey: QUERY_KEYS.metaAds(clientId, dateRange),
    queryFn: () => dashboardApi.metaAds(clientId, dateRange.startDate, dateRange.endDate),
    enabled: !!clientId,
  })

export const useWebsite = (clientId: string, dateRange: DateRange, locationId?: string) =>
  useQuery({
    queryKey: QUERY_KEYS.website(clientId, dateRange, locationId),
    queryFn: () => dashboardApi.website(clientId, dateRange.startDate, dateRange.endDate, locationId),
    enabled: !!clientId,
  })

export const useFunnelRoi = (clientId: string, dateRange: DateRange) =>
  useQuery({
    queryKey: QUERY_KEYS.funnelRoi(clientId, dateRange),
    queryFn: () => dashboardApi.funnelRoi(clientId, dateRange.startDate, dateRange.endDate),
    enabled: !!clientId,
  })

export const useGbp = (clientId: string, dateRange: DateRange) =>
  useQuery({
    queryKey: QUERY_KEYS.gbp(clientId, dateRange),
    queryFn: () => dashboardApi.gbp(clientId, dateRange.startDate, dateRange.endDate),
    enabled: !!clientId && !!dateRange.startDate && !!dateRange.endDate,
    staleTime: 0,
    refetchOnMount: true,
  })

// ─── Clients list ─────────────────────────────────────────────────────
export const useClients = () =>
  useQuery({
    queryKey: QUERY_KEYS.clients(),
    queryFn: () => clientsApi.getAll(),
    staleTime: 0,
  })

// ─── Sync logs ────────────────────────────────────────────────────────
// Auto-refreshes every 30 seconds so status updates live
export const useSyncLogs = (clientId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.syncLogs(clientId),
    queryFn: () => syncApi.getLogs(clientId),
    enabled: !!clientId,
    // refetchInterval: 30 * 1000,
  })

// ─── Date range state ─────────────────────────────────────────────────
// Simple local state — not React Query (it's UI state, not server state)
export const useDateRange = () => {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange)
  return { dateRange, setDateRange }
}