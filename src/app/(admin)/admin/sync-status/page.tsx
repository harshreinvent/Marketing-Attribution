'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuthInit } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import { useClients } from '@/hooks/useDashboard'
import { syncApi } from '@/lib/endpoints'
import { Sidebar } from '@/components/layout/Sidebar'
import { LoadingState , Loader } from '@/components/ui'
import {
  RefreshCw, CheckCircle2, XCircle, Clock, Loader2,
  Activity, Database, Zap, TrendingUp,
  Hash, Play, ChevronDown, FileText, X,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import type { Client } from '@/types'

// ─── Config ───────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  SUCCESS: { icon: <CheckCircle2 size={12} />, cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Success' },
  FAILED:  { icon: <XCircle size={12} />,      cls: 'bg-red-50 text-red-700 border border-red-200',            label: 'Failed'  },
  RUNNING: { icon: <Loader2 size={12} className="animate-spin" />, cls: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'Running' },
  PENDING: { icon: <Clock size={12} />,         cls: 'bg-slate-100 text-slate-600 border border-slate-200',    label: 'Pending' },
}

const PROVIDERS = [
  { value: 'GOOGLE_ADS', label: 'Google Ads', icon: <TrendingUp size={12} />, color: 'text-blue-600'   },
  { value: 'META_ADS',   label: 'Meta Ads',   icon: <Zap size={12} />,        color: 'text-purple-600' },
  { value: 'GA4',        label: 'GA4',        icon: <Activity size={12} />,   color: 'text-orange-600' },
  { value: 'GMB',        label: 'GMB',        icon: <Database size={12} />,   color: 'text-teal-600'   },
]

const DATE_OPTIONS = [
  { value: 'TODAY',     label: 'Today'        },
  { value: 'YESTERDAY', label: 'Yesterday'    },
  { value: 'LAST_7',    label: 'Last 7 Days'  },
  { value: 'LAST_30',   label: 'Last 30 Days' },
  { value: 'CUSTOM',    label: 'Custom Range' },
]

const getDateRange = (option: string, customFrom?: string, customTo?: string) => {
  const today = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const sub = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return fmt(d) }
  switch (option) {
    case 'TODAY':     return { startDate: fmt(today), endDate: fmt(today) }
    case 'YESTERDAY': return { startDate: sub(1),     endDate: sub(1)     }
    case 'LAST_7':    return { startDate: sub(7),     endDate: fmt(today) }
    case 'LAST_30':   return { startDate: sub(30),    endDate: fmt(today) }
    case 'CUSTOM':    return { startDate: customFrom!, endDate: customTo! }
    default:          return null
  }
}

const formatDateTime = (d: string) =>
  new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })

const getDuration = (start: string, end?: string) => {
  if (!end) return null
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

// ─── Log Modal ────────────────────────────────────────────────────────

function LogModal({ log, onClose }: { log: any; onClose: () => void }) {
  const status   = STATUS_CONFIG[log.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING
  const provider = PROVIDERS.find(p => p.value === log.provider)
  const logLines: string[] = log.logs ? log.logs.split('\n') : []

  const lineColor = (line: string) => {
    if (line.includes('❌')) return 'text-red-500'
    if (line.includes('✅')) return 'text-emerald-600'
    if (line.includes('⚠️')) return 'text-amber-500'
    return 'text-slate-700'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${status.cls}`}>
              {status.icon} {status.label}
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {log.clientName} · {provider?.label || log.provider}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-px bg-slate-100 flex-shrink-0">
          {[
            { label: 'Start Time',     value: formatDateTime(log.startedAt) },
            { label: 'End Time',       value: log.completedAt ? formatDateTime(log.completedAt) : '—' },
            { label: 'Duration',       value: getDuration(log.startedAt, log.completedAt) || '—' },
            { label: 'Records Synced', value: log.recordsSync?.toLocaleString() || '0' },
          ].map(s => (
            <div key={s.label} className="bg-white px-4 py-3">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="px-5 py-2.5 flex items-center justify-between flex-shrink-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sync Log</p>
            {logLines.length > 0 && <span className="text-xs text-slate-400">{logLines.length} lines</span>}
          </div>
          <div className="border-t border-slate-200 flex-shrink-0" />
          <div className="flex-1 overflow-y-auto px-5 py-4 bg-white rounded-b-2xl"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
            {logLines.length === 0 ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-xs text-slate-400">No log output available</p>
              </div>
            ) : (
              <div className="font-sans text-xs space-y-1">
                {logLines.map((line: string, i: number) => (
                  <div key={i} className={`leading-relaxed ${lineColor(line)}`}>{line}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────

function Pagination({ page, totalPages, total, pageSize, onPage }: {
  page: number; totalPages: number; total: number; pageSize: number; onPage: (p: number) => void
}) {
  if (totalPages <= 1) return null
  const from = (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, total)

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5)        return i + 1
    if (page <= 3)              return i + 1
    if (page >= totalPages - 2) return totalPages - 4 + i
    return page - 2 + i
  })

  return (
    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
      <p className="text-xs text-slate-400">Showing {from}–{to} of {total} sync jobs</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(page - 1)} disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={14} className="text-slate-600" />
        </button>
        {pages.map(p => (
          <button key={p} onClick={() => onPage(p)}
            className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-brand-600 text-white' : 'hover:bg-slate-200 text-slate-600'}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={14} className="text-slate-600" />
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function SyncStatusPage() {
  useAuthInit()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuthStore()
  const { data: clients = [], isLoading: clientsLoading } = useClients()

  const [selectedClient,   setSelectedClient]   = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedDate,     setSelectedDate]     = useState('')
  const [customFrom,       setCustomFrom]       = useState('')
  const [customTo,         setCustomTo]         = useState('')
  const [errors,           setErrors]           = useState<Record<string, string>>({})
  const [logModal,         setLogModal]         = useState<any>(null)
  const [page,             setPage]             = useState(1)
  const [syncLoading,      setSyncLoading]      = useState(false)

  // Store the timestamp just before we fire the sync request
  // so we can identify which log row belongs to this sync
  const syncStartTimeRef = useRef<number>(0)
  const pollIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollTimeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current)  clearInterval(pollIntervalRef.current)
      if (pollTimeoutRef.current)   clearTimeout(pollTimeoutRef.current)
    }
  }, [])

  const { data: logsData, isLoading: logsLoading, refetch } = useQuery({
    queryKey: ['all-sync-logs', page],
    queryFn: async () => {
      const result = await syncApi.getAllLogs({ page, pageSize: 15 })
      const clientMap = Object.fromEntries(clients.map((c: Client) => [c.id, c.name]))
      return {
        ...result,
        logs: result.logs.map((l: any) => ({
          ...l,
          clientName: l.client?.name || clientMap[l.clientId] || 'Unknown',
        })),
      }
    },
    enabled: clients.length > 0,
  })

  const allLogs    = logsData?.logs       || []
  const pagination = logsData?.pagination || { page: 1, pageSize: 15, total: 0, totalPages: 1 }

  // ── Smart polling: stop as soon as the triggered sync is done ────────
  // After each refetch, check if any log started AFTER our trigger time
  // has resolved to SUCCESS or FAILED. If yes → stop polling + hide loader.
  useEffect(() => {
    if (!syncLoading || allLogs.length === 0) return

    const resolved = allLogs.some((l: any) => {
      const startedAfterTrigger = new Date(l.startedAt).getTime() >= syncStartTimeRef.current
      return startedAfterTrigger && (l.status === 'SUCCESS' || l.status === 'FAILED')
    })

    if (resolved) {
      stopPolling()
    }
  }, [allLogs, syncLoading])

  const stopPolling = () => {
    if (pollIntervalRef.current)  { clearInterval(pollIntervalRef.current);  pollIntervalRef.current = null }
    if (pollTimeoutRef.current)   { clearTimeout(pollTimeoutRef.current);    pollTimeoutRef.current  = null }
    setSyncLoading(false)
  }

  const startPolling = () => {
    // Clear any previous poll
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    if (pollTimeoutRef.current)  clearTimeout(pollTimeoutRef.current)

    // Poll every 3s
    pollIntervalRef.current = setInterval(() => {
      refetch()
    }, 3000)

    // Safety ceiling: 5 minutes — if sync is still running after that, just stop the loader
    pollTimeoutRef.current = setTimeout(() => {
      stopPolling()
    }, 5 * 60 * 1000)
  }

  const { mutate: triggerSync, isPending: syncing } = useMutation({
    mutationFn: async () => {
      const errs: Record<string, string> = {}
      if (!selectedClient)   errs.client   = 'Please select a client'
      if (!selectedProvider) errs.provider = 'Please select a provider'
      if (!selectedDate)     errs.date     = 'Please select a date range'
      if (selectedDate === 'CUSTOM' && (!customFrom || !customTo))
        errs.date = 'Please select both start and end dates'
      if (Object.keys(errs).length > 0) { setErrors(errs); throw new Error('Validation failed') }
      setErrors({})
      const range = getDateRange(selectedDate, customFrom, customTo)!
      return syncApi.trigger(selectedClient, { providers: [selectedProvider], ...range })
    },
    onSuccess: () => {
      // Record time just before trigger so polling can identify this sync's log
      syncStartTimeRef.current = Date.now() - 5000 // 5s buffer for clock skew
      setSyncLoading(true)
      startPolling()
    },
    onError: () => setSyncLoading(false),
  })

  if (authLoading || clientsLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingState /></div>
  }

  const successCount = allLogs.filter((l: any) => l.status === 'SUCCESS').length
  const failedCount  = allLogs.filter((l: any) => l.status === 'FAILED').length
  const runningCount = allLogs.filter((l: any) => l.status === 'RUNNING').length

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <main className="flex-1 min-w-0 overflow-auto">

        {/* ── Page Header ── */}
        <div className="bg-white border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-slate-500" />
                <h1 className="text-lg font-bold text-slate-900">Sync Status</h1>
                <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-600 font-medium">Live</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Monitor and trigger data sync jobs · Auto-refreshes every 30s</p>
            </div>
            <button onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
              <RefreshCw size={13} className={logsLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* ── Trigger Sync Panel ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center">
                <Play size={14} className="text-brand-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Trigger Sync</h2>
                <p className="text-xs text-slate-400">Select client, provider and date range to start a sync</p>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Client <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <select value={selectedClient}
                      onChange={e => { setSelectedClient(e.target.value); setErrors(p => ({ ...p, client: '' })) }}
                      className={`w-full appearance-none bg-slate-50 border rounded-xl px-3 py-2.5 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors ${errors.client ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                      <option value="">Select client...</option>
                      {clients.map((c: Client) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.client && <p className="text-xs text-red-500 mt-1">{errors.client}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Data Source <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <select value={selectedProvider}
                      onChange={e => { setSelectedProvider(e.target.value); setErrors(p => ({ ...p, provider: '' })) }}
                      className={`w-full appearance-none bg-slate-50 border rounded-xl px-3 py-2.5 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors ${errors.provider ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                      <option value="">Select source...</option>
                      {PROVIDERS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.provider && <p className="text-xs text-red-500 mt-1">{errors.provider}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Date Range <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <select value={selectedDate}
                      onChange={e => { setSelectedDate(e.target.value); setErrors(p => ({ ...p, date: '' })) }}
                      className={`w-full appearance-none bg-slate-50 border rounded-xl px-3 py-2.5 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors ${errors.date ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                      <option value="">Select range...</option>
                      {DATE_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>

                <button onClick={() => triggerSync()} disabled={syncing || syncLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-brand-500/20">
                  {syncing || syncLoading
                    ? <><Loader2 size={14} className="animate-spin" /> Syncing...</>
                    : <><Play size={14} /> Start Sync</>
                  }
                </button>
              </div>

              {selectedDate === 'CUSTOM' && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Start Date</label>
                    <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">End Date</label>
                    <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Sync History Table ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Sync History</h2>
                <p className="text-xs text-slate-400 mt-0.5">{pagination.total} total sync jobs</p>
              </div>
              <div className="flex items-center gap-2">
                {successCount > 0 && <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">{successCount} Success</span>}
                {failedCount  > 0 && <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-red-50 text-red-700 border-red-200">{failedCount} Failed</span>}
                {runningCount > 0 && <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">{runningCount} Running</span>}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 px-6 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">S.No</div>
              <div className="col-span-2">Client</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2">Old Count</div>
              <div className="col-span-2">New Count</div>
              <div className="col-span-1">Records</div>
              <div className="col-span-1">Log</div>
              <div className="col-span-1">Status</div>
            </div>

            {logsLoading ? (
              <div className="py-12 text-center">
                <Loader2 size={20} className="animate-spin text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Loading sync logs...</p>
              </div>
            ) : allLogs.length === 0 ? (
              <div className="py-16 text-center">
                <Database size={28} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No sync jobs yet</p>
                <p className="text-xs text-slate-400 mt-1">Use the form above to trigger your first sync</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {allLogs.map((log: any, i: number) => {
                  const status   = STATUS_CONFIG[log.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING
                  const provider = PROVIDERS.find(p => p.value === log.provider)
                  const rowNum   = (page - 1) * 15 + i + 1

                  return (
                    <div key={log.id} className="grid grid-cols-12 gap-2 px-6 py-3 items-center hover:bg-slate-50/60 transition-colors">
                      <div className="col-span-1">
                        <span className="text-xs text-slate-400 font-mono">{String(rowNum).padStart(2, '0')}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-brand-600">{log.clientName?.charAt(0)}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-700 truncate">{log.clientName}</span>
                      </div>
                      <div className="col-span-2">
                        {provider
                          ? <span className={`text-xs font-medium ${provider.color} flex items-center gap-1`}>{provider.icon} {provider.label}</span>
                          : <span className="text-xs text-slate-400">{log.provider}</span>
                        }
                      </div>
                      <div className="col-span-2">
                        {log.oldCount > 0
                          ? <span className="text-xs font-semibold text-slate-700">{log.oldCount.toLocaleString()}</span>
                          : <span className="text-xs text-slate-300">—</span>
                        }
                      </div>
                      <div className="col-span-2">
                        {log.newCount > 0
                          ? <span className="text-xs font-semibold text-slate-700">{log.newCount.toLocaleString()}</span>
                          : <span className="text-xs text-slate-300">—</span>
                        }
                      </div>
                      <div className="col-span-1">
                        {log.recordsSync > 0
                          ? <div className="flex items-center gap-1"><Hash size={9} className="text-slate-400" /><span className="text-xs font-semibold text-slate-700">{log.recordsSync.toLocaleString()}</span></div>
                          : <span className="text-xs text-slate-300">—</span>
                        }
                      </div>
                      <div className="col-span-1">
                        <button onClick={() => setLogModal(log)}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">
                          <FileText size={11} /> Log
                        </button>
                      </div>
                      <div className="col-span-1">
                        <div className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${status.cls}`}>
                          {status.icon}
                          <span className="hidden xl:inline">{status.label}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onPage={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            />
          </div>
        </div>
      </main>

      {logModal && <LogModal log={logModal} onClose={() => setLogModal(null)} />}
      {(syncing || syncLoading) && <Loader type="custom" />}
    </div>
  )
}