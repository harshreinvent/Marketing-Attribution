'use client'
import { useSyncLogs } from '@/hooks/useDashboard'
import { AlertCircle, Loader2, Clock, CheckCircle2 } from 'lucide-react'

interface SyncBannerProps {
  clientId: string
  showStatus?: boolean
}

export const SyncBanner = ({ clientId, showStatus } : SyncBannerProps ) => {
  const { data } = useSyncLogs(clientId)

  const logs = Array.isArray(data) ? data : data?.logs

  if (!logs || logs.length === 0) return null

  const lastSuccess = logs.find((l: any) => l.status === 'SUCCESS')
  const hasRunning  = logs.some((l: any) => l.status === 'RUNNING')
  const lastFailed  = !hasRunning && logs[0]?.status === 'FAILED' ? logs[0] : null

  if (hasRunning) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center gap-2">
        <Loader2 size={12} className="text-amber-500 animate-spin flex-shrink-0" />
        <span className="text-xs font-medium text-amber-700">Sync in progress</span>
        <span className="text-xs text-amber-600">— data is being updated...</span>
      </div>
    )
  }

  if (lastFailed) {
    const failedAt = new Date(lastFailed.completedAt || lastFailed.startedAt)
    return (
      <div className="bg-red-50 border-b border-red-200 px-6 py-2 flex items-center gap-2">
        <AlertCircle size={12} className="text-red-500 flex-shrink-0" />
        <span className="text-xs font-medium text-red-700">Sync failed</span>
        <span className="text-xs text-red-500">
          · {failedAt.toLocaleDateString('en-IN', { dateStyle: 'medium' })} at {failedAt.toLocaleTimeString('en-IN', { timeStyle: 'short' })}
        </span>
        {lastSuccess && (
          <span className="text-xs text-red-400 ml-1">
            · Last successful sync: {new Date(lastSuccess.completedAt || lastSuccess.startedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </span>
        )}
      </div>
    )
  }

  if (lastSuccess) {
    const syncedAt = new Date(lastSuccess.completedAt || lastSuccess.startedAt)
    return (
      <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center gap-2">
        <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
        <span className="text-xs font-medium text-emerald-700">Sync successful</span>
        <span className="text-xs text-emerald-600">
          · {syncedAt.toLocaleDateString('en-IN', { dateStyle: 'medium' })} at {syncedAt.toLocaleTimeString('en-IN', { timeStyle: 'short' })}
        </span>
        <span className="text-xs text-emerald-500 ml-1">· {lastSuccess.recordsSync} records</span>
      </div>
    )
  }

  return null
}