'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useAuthInit } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import { useClients } from '@/hooks/useDashboard'
import { syncApi } from '@/lib/endpoints'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card, CardContent, Badge, LoadingState } from '@/components/ui'
import { RefreshCw, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import type { Client } from '@/types'

const STATUS_ICONS = {
  SUCCESS: <CheckCircle size={14} className="text-emerald-500" />,
  FAILED:  <XCircle size={14} className="text-red-500" />,
  RUNNING: <Loader2 size={14} className="text-amber-500 animate-spin" />,
  PENDING: <Clock size={14} className="text-slate-400" />,
}

const STATUS_BADGE: Record<string, 'green' | 'red' | 'yellow' | 'gray'> = {
  SUCCESS: 'green',
  FAILED: 'red',
  RUNNING: 'yellow',
  PENDING: 'gray',
}

export default function SyncStatusPage() {
  useAuthInit()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuthStore()
  const { data: clients = [], isLoading: clientsLoading } = useClients()

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading])

  if (authLoading || clientsLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingState /></div>
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <main className="flex-1 min-w-0">
        <div className="bg-white border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-slate-500" />
            <h1 className="text-lg font-bold text-slate-900">Sync Status</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Monitor data sync jobs across all clients. Auto-refreshes every 30 seconds.</p>
        </div>

        <div className="p-6 space-y-4">
          {clients.map((client: Client) => (
            <ClientSyncCard key={client.id} client={client} />
          ))}
        </div>
      </main>
    </div>
  )
}

// Separate component per client — each fetches its own sync logs
function ClientSyncCard({ client }: { client: Client }) {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['sync-logs', client.id],
    queryFn: () => syncApi.getLogs(client.id),
    refetchInterval: 30 * 1000,
  })

  return (
    <Card>
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
            <span className="text-sm font-bold text-brand-600">{client.name.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{client.name}</p>
            <p className="text-xs text-slate-400">{client.slug}</p>
          </div>
        </div>
        {isLoading && <Loader2 size={14} className="text-slate-400 animate-spin" />}
      </div>

      <CardContent>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No sync logs yet</p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 5).map((log: any) => (
              <div key={log.id} className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {STATUS_ICONS[log.status as keyof typeof STATUS_ICONS] || STATUS_ICONS.PENDING}
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-700">{log.provider}</span>
                    {log.errorMsg && (
                      <p className="text-xs text-red-500 truncate max-w-xs">{log.errorMsg}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {log.recordsSync > 0 && (
                    <span className="text-xs text-slate-400">{log.recordsSync} records</span>
                  )}
                  <Badge variant={STATUS_BADGE[log.status] || 'gray'}>{log.status}</Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(log.startedAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
