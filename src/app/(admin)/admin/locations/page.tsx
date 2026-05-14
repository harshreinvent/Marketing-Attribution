'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useAuthInit } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import { useClients } from '@/hooks/useDashboard'
import { clientsApi } from '@/lib/endpoints'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card, CardContent, Badge, LoadingState } from '@/components/ui'
import { MapPin, Phone, Building2 } from 'lucide-react'
import type { Client, Location } from '@/types'

export default function LocationsPage() {
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
            <MapPin size={16} className="text-slate-500" />
            <h1 className="text-lg font-bold text-slate-900">Locations</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">All clinic branches across all clients</p>
        </div>

        <div className="p-6 space-y-5">
          {clients.map((client: Client) => (
            <ClientLocationsCard key={client.id} client={client} />
          ))}
        </div>
      </main>
    </div>
  )
}

function ClientLocationsCard({ client }: { client: Client }) {
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', client.id],
    queryFn: () => clientsApi.getLocations(client.id),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <Card>
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
          <span className="text-sm font-bold text-brand-600">{client.name.charAt(0)}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{client.name}</p>
          <p className="text-xs text-slate-400">{locations.length} location{locations.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <CardContent>
        {isLoading ? (
          <p className="text-xs text-slate-400 text-center py-4">Loading...</p>
        ) : locations.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No locations configured</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {locations.map((loc: Location) => (
              <div key={loc.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-slate-400 flex-shrink-0" />
                    <p className="text-xs font-semibold text-slate-800">{loc.name}</p>
                  </div>
                  <Badge variant={loc.isActive ? 'green' : 'gray'}>
                    {loc.isActive ? 'Active' : 'Off'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <MapPin size={11} />
                  {loc.city}
                  {loc.address && <span className="text-slate-400">· {loc.address}</span>}
                </div>
                {loc.trackingPhone && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Phone size={11} />
                    <span className="font-mono">{loc.trackingPhone}</span>
                    <span className="text-slate-300">(tracking)</span>
                  </div>
                )}
                {(loc as any).gmbListings?.length > 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    {(loc as any).gmbListings.length} GMB listing{(loc as any).gmbListings.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
