'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthInit } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import { useClients } from '@/hooks/useDashboard'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { clientsApi } from '@/lib/endpoints'
import { Sidebar } from '@/components/layout/Sidebar'
import { LoadingState, ErrorState, Badge } from '@/components/ui'
import { EditClientModal } from '@/components/common/EditClientModal'
import type { Client } from '@/types'
import {
  Users, MapPin, BarChart3, Search, Plus,
  MoreVertical, ExternalLink, Pencil, Trash2,
  ToggleLeft, ToggleRight, Loader2, X
} from 'lucide-react'

const SERVICE_COLORS: Record<string, 'blue' | 'green' | 'yellow' | 'gray'> = {
  GOOGLE_ADS: 'blue',
  META_ADS: 'blue',
  WEBSITE_ORGANIC: 'green',
  GMB: 'yellow',
  WHATSAPP: 'green',
  SEO: 'gray',
}

// ─── Three dot menu ───────────────────────────────────────────────────

function ClientMenu({
  client,
  onEdit,
  onDelete,
  onToggle,
}: {
  client: Client
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative" onClick={e => e.preventDefault()}>
      <button
        onClick={e => { e.preventDefault(); setOpen(p => !p) }}
        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <MoreVertical size={15} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-slate-100 shadow-lg z-20 py-1 overflow-hidden">
          <Link
            href={`/admin/clients/${client.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink size={13} /> Open Dashboard
          </Link>
          <button
            onClick={() => { setOpen(false); onEdit() }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Pencil size={13} /> Edit Client
          </button>
          <button
            onClick={() => { setOpen(false); onToggle() }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {client.isActive
              ? <><ToggleLeft size={13} /> Deactivate</>
              : <><ToggleRight size={13} /> Activate</>
            }
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={() => { setOpen(false); onDelete() }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} /> Delete Client
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Delete confirmation modal ─────────────────────────────────────────

function DeleteModal({
  client,
  onClose,
  onConfirm,
  loading,
}: {
  client: Client
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Delete Client</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={15} className="text-slate-500" />
          </button>
        </div>
        <div className="p-5">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <p className="text-sm text-center text-slate-700 mb-1">
            Are you sure you want to delete <strong>{client.name}</strong>?
          </p>
          <p className="text-xs text-center text-slate-400">
            This will permanently delete all campaigns, metrics, sync logs and user accounts for this client.
          </p>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  useAuthInit()
  const router = useRouter()
  const qc = useQueryClient()
  const { user, isLoading: authLoading } = useAuthStore()
  const [search, setSearch] = useState('')
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [deleteClient, setDeleteClient] = useState<Client | null>(null)

  const { data: clients = [], isLoading, error } = useClients()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    // CLIENT_ADMIN / CLIENT_MEMBER should never see the admin page
    // redirect them to their own dashboard
    if (!authLoading && user) {
      if (user.role === 'CLIENT_ADMIN' || user.role === 'CLIENT_MEMBER') {
        if (user.clientId) {
          router.push(`/admin/clients/${user.clientId}`)
        } else {
          router.push('/login')
        }
      }
    }
  }, [user, authLoading])

  // Toggle active/inactive
  const { mutate: toggleActive } = useMutation({
    mutationFn: (client: Client) =>
      clientsApi.toggleActive(client.id, !client.isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })

  // Delete client
  const { mutate: deleteClientMutation, isPending: deleting } = useMutation({
    mutationFn: (clientId: string) => clientsApi.delete(clientId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      setDeleteClient(null)
    },
  })

  const filtered = clients.filter((c: Client) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  // Show loading while auth resolves OR while redirecting client users
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center"><LoadingState /></div>
  )

  // Don't render admin UI for client roles (redirect in progress)
  if (user?.role === 'CLIENT_ADMIN' || user?.role === 'CLIENT_MEMBER') {
    return <div className="min-h-screen flex items-center justify-center"><LoadingState /></div>
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <main className="flex-1 min-w-0">

        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-lg font-bold text-slate-900">All Clients</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.firstName} {user?.lastName} · {user?.role?.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-52 bg-white"
                />
              </div>
              <Link
                href="/admin/clients/new"
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Plus size={14} /> Add Client
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading && <LoadingState message="Loading clients..." />}
          {error && <ErrorState message={(error as Error).message} />}

          {!isLoading && !error && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Total Clients',   value: clients.length,                                                               icon: <Users size={15} />    },
                  { label: 'Active',           value: clients.filter((c: Client) => c.isActive).length,                            icon: <BarChart3 size={15} /> },
                  { label: 'Total Locations',  value: clients.reduce((s: number, c: Client) => s + (c._count?.locations || 0), 0), icon: <MapPin size={15} />   },
                  { label: 'Total Leads',      value: clients.reduce((s: number, c: Client) => s + (c._count?.leads || 0), 0),     icon: <Users size={15} />    },
                ].map(stat => (
                  <div key={stat.label} className="bg-white border border-slate-100 rounded-xl p-4 shadow-card">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      {stat.icon}
                      <span className="text-xs">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Client cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((client: Client) => (
                  <div
                    key={client.id}
                    className={`relative bg-white border rounded-xl p-5 shadow-card transition-all ${
                      client.isActive
                        ? 'border-slate-100 hover:shadow-card-hover hover:border-brand-200'
                        : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                        <span className="text-lg font-bold text-brand-600">{client.name.charAt(0)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={client.isActive ? 'green' : 'gray'}>
                          {client.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <ClientMenu
                          client={client}
                          onEdit={() => setEditClient(client)}
                          onDelete={() => setDeleteClient(client)}
                          onToggle={() => toggleActive(client)}
                        />
                      </div>
                    </div>

                    {/* Card title is a link to client dashboard */}
                    <Link href={`/admin/clients/${client.id}`} className="block group">
                      <h3 className="font-semibold text-slate-900 mb-0.5 group-hover:text-brand-700 transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">{client.slug}</p>
                    </Link>

                    {client.services && client.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {client.services.map((s: { service: string }) => (
                          <Badge key={s.service} variant={SERVICE_COLORS[s.service] || 'gray'}>
                            {s.service.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-50">
                      <span className="flex items-center gap-1"><MapPin size={11} />{client._count?.locations || 0} locations</span>
                      <span className="flex items-center gap-1"><Users size={11} />{client._count?.leads || 0} leads</span>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400">
                    <p className="text-sm">No clients found</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editClient && (
        <EditClientModal
          client={editClient}
          onClose={() => setEditClient(null)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ['clients'] })
            setEditClient(null)
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteClient && (
        <DeleteModal
          client={deleteClient}
          onClose={() => setDeleteClient(null)}
          onConfirm={() => deleteClientMutation(deleteClient.id)}
          loading={deleting}
        />
      )}
    </div>
  )
}
