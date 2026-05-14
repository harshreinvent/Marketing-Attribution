'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthInit } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import { useClients } from '@/hooks/useDashboard'
import { Sidebar } from '@/components/layout/Sidebar'
import { LoadingState, ErrorState, Badge } from '@/components/ui'
import { useState } from 'react'
import type { Client } from '@/types'
import { Users, MapPin, BarChart3, ExternalLink, Search } from 'lucide-react'

const SERVICE_COLORS: Record<string, 'blue' | 'green' | 'yellow' | 'gray'> = {
  GOOGLE_ADS: 'blue',
  META_ADS: 'blue',
  WEBSITE_ORGANIC: 'green',
  GMB: 'yellow',
  WHATSAPP: 'green',
  SEO: 'gray',
}

export default function AdminPage() {
  useAuthInit()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuthStore()
  const [search, setSearch] = useState('')

  // React Query — auto-caches, no manual useEffect needed
  const { data: clients = [], isLoading, error } = useClients()

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading])

  const filtered = clients.filter((c: Client) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingState /></div>

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
                  { label: 'Total Clients', value: clients.length, icon: <Users size={15} /> },
                  { label: 'Active', value: clients.filter((c: Client) => c.isActive).length, icon: <BarChart3 size={15} /> },
                  { label: 'Total Locations', value: clients.reduce((s: number, c: Client) => s + (c._count?.locations || 0), 0), icon: <MapPin size={15} /> },
                  { label: 'Total Leads', value: clients.reduce((s: number, c: Client) => s + (c._count?.leads || 0), 0), icon: <Users size={15} /> },
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
                  <Link
                    key={client.id}
                    href={`/admin/clients/${client.id}`}
                    className="group bg-white border border-slate-100 rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                        <span className="text-lg font-bold text-brand-600">{client.name.charAt(0)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={client.isActive ? 'green' : 'gray'}>
                          {client.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-brand-400 transition-colors" />
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-0.5 group-hover:text-brand-700 transition-colors">{client.name}</h3>
                    <p className="text-xs text-slate-400 mb-3">{client.slug}</p>

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
                  </Link>
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
    </div>
  )
}
