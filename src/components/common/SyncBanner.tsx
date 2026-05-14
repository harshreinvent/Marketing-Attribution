'use client'
import { useSyncLogs } from '@/hooks/useDashboard'
import { CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react'

export const SyncBanner = ({ clientId }: { clientId: string }) => {
  const { data: logs } = useSyncLogs(clientId)

  if (!logs || logs.length === 0) return null

  // Find the most recent successful sync
  const lastSuccess = logs.find((l: any) => l.status === 'SUCCESS')
  const hasRunning = logs.some((l: any) => l.status === 'RUNNING')
  const lastFailed = !hasRunning && logs[0]?.status === 'FAILED' ? logs[0] : null

  if (hasRunning) {
    return (
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center gap-2">
        <Loader2 size={12} className="text-amber-500 animate-spin" />
        <span className="text-xs text-amber-700">Data sync in progress...</span>
      </div>
    )
  }

  if (lastFailed) {
    return (
      <div className="bg-red-50 border-b border-red-100 px-6 py-2 flex items-center gap-2">
        <AlertCircle size={12} className="text-red-500" />
        <span className="text-xs text-red-700">Last sync failed — {lastFailed.errorMsg || 'unknown error'}</span>
      </div>
    )
  }

  if (lastSuccess) {
    const syncedAt = new Date(lastSuccess.completedAt || lastSuccess.startedAt)
    return (
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-2 flex items-center gap-2">
        <Clock size={12} className="text-slate-400" />
        <span className="text-xs text-slate-500">
          Data updated: {syncedAt.toLocaleDateString('en-IN', { dateStyle: 'medium' })} at {syncedAt.toLocaleTimeString('en-IN', { timeStyle: 'short' })}
        </span>
        <span className="text-xs text-slate-400 ml-1">· {lastSuccess.recordsSync} records</span>
      </div>
    )
  }

  return null
}
