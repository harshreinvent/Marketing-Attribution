'use client'
import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthInit } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import { useCapabilities, useDateRange } from '@/hooks/useDashboard'
import { clientsApi, syncApi } from '@/lib/endpoints'
import { useQuery } from '@tanstack/react-query'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { SyncBanner } from '@/components/common/SyncBanner'
import { LoadingState } from '@/components/ui'
import { ExecutiveTab } from '@/components/dashboard/ExecutiveTab'
import { GoogleAdsTab } from '@/components/dashboard/GoogleAdsTab'
import { MetaAdsTab } from '@/components/dashboard/MetaAdsTab'
import { WebsiteTab } from '@/components/dashboard/WebsiteTab'
import { FunnelRoiTab } from '@/components/dashboard/FunnelRoiTab'
import { LayoutDashboard, BarChart3, Target, Globe, TrendingUp, ArrowLeft } from 'lucide-react'
import { DATE_PRESETS } from '@/utils'

export default function ClientDashboardPage() {
  useAuthInit()
  const router = useRouter()
  const params = useParams()
  const clientId = params.clientId as string

  const { user, isLoading: authLoading } = useAuthStore()
  const { dateRange, setDateRange } = useDateRange()
  const { data: capabilities, isLoading: capsLoading } = useCapabilities(clientId)
  const [activeTab, setActiveTab] = useState('executive')
  const [syncing, setSyncing] = useState(false)

  // Fetch client info with React Query
  const { data: client } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientsApi.getById(clientId),
    enabled: !!clientId,
  })

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading])

  // Build dynamic tabs based on capabilities
  const tabs = useMemo(() => {
    if (!capabilities) return []
    const list = [
      { key: 'executive', label: 'Executive Summary', icon: <LayoutDashboard size={15} /> },
    ]
    if (capabilities.hasGoogleAds)
      list.push({ key: 'google-ads', label: 'Google Ads', icon: <BarChart3 size={15} /> })
    if (capabilities.hasMetaAds)
      list.push({ key: 'meta-ads', label: 'Meta Ads', icon: <Target size={15} /> })
    if (capabilities.hasWebsiteOrganic) {
      if (capabilities.websiteSplitByLocation && capabilities.locations.length > 1) {
        capabilities.locations.forEach(loc => {
          list.push({ key: `website-${loc.id}`, label: `Website / ${loc.city}`, icon: <Globe size={15} /> })
        })
      } else {
        list.push({ key: 'website', label: 'Website / Organic', icon: <Globe size={15} /> })
      }
    }
    list.push({ key: 'funnel-roi', label: 'Funnel & ROI', icon: <TrendingUp size={15} /> })
    return list
  }, [capabilities])

  const isAgencyUser = user?.role !== 'CLIENT_ADMIN' && user?.role !== 'CLIENT_MEMBER'

  const handleSync = async () => {
    setSyncing(true)
    try { await syncApi.trigger(clientId) } catch {}
    setTimeout(() => setSyncing(false), 2000)
  }

  const renderTab = () => {
    if (activeTab === 'executive')  return <ExecutiveTab clientId={clientId} dateRange={dateRange} />
    if (activeTab === 'google-ads') return <GoogleAdsTab clientId={clientId} dateRange={dateRange} />
    if (activeTab === 'meta-ads')   return <MetaAdsTab clientId={clientId} dateRange={dateRange} />
    if (activeTab === 'funnel-roi') return <FunnelRoiTab clientId={clientId} dateRange={dateRange} />
    if (activeTab === 'website')    return <WebsiteTab clientId={clientId} dateRange={dateRange} />
    if (activeTab.startsWith('website-')) {
      const locationId = activeTab.replace('website-', '')
      const location = capabilities?.locations.find(l => l.id === locationId)
      return <WebsiteTab clientId={clientId} dateRange={dateRange} locationId={locationId} locationName={location?.name} />
    }
    return null
  }

  if (authLoading || capsLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingState /></div>
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar clientId={clientId} clientName={client?.name} tabs={tabs.map(t => ({ ...t, href: '#' }))} isAdmin={isAgencyUser} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Back link for agency users */}
        {isAgencyUser && (
          <div className="bg-white border-b border-slate-100 px-6 py-2">
            <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors">
              <ArrowLeft size={12} />
              Back to all clients
            </Link>
          </div>
        )}

        <Header
          title={client?.name || 'Client Dashboard'}
          subtitle={`${capabilities?.locationCount || 0} locations · ${capabilities?.services.join(', ') || ''}`}
          dateRange={dateRange}
          onDateChange={setDateRange}
          onSync={isAgencyUser ? handleSync : undefined}
          syncing={syncing}
        />

        {/* Sync banner — shows last sync time or running status */}
        <SyncBanner clientId={clientId} />

        {/* Tab bar with date presets */}
        <div className="bg-white border-b border-slate-100">
          <div className="px-6 flex items-center justify-between flex-wrap gap-2 py-1">
            {/* Tabs */}
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center gap-1.5 px-4 py-3.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors
                    ${activeTab === tab.key
                      ? 'border-brand-600 text-brand-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Date presets */}
            <div className="flex gap-1.5 flex-wrap py-1">
              {DATE_PRESETS.map(preset => {
                const isActive = dateRange.startDate === preset.range.startDate && dateRange.endDate === preset.range.endDate
                return (
                  <button
                    key={preset.label}
                    onClick={() => setDateRange(preset.range)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      isActive
                        ? 'bg-brand-50 border-brand-200 text-brand-700 font-medium'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
