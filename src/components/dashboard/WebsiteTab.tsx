'use client'
import { StatCard, Card, CardHeader, CardTitle, Table, Th, Td, LoadingState, ErrorState, NoIntegration } from '@/components/ui'
import { ExportButton } from '@/components/common/ExportButton'
import { useWebsite } from '@/hooks/useDashboard'
import { formatNumber, formatPercent } from '@/lib/utils'
import { Globe, Users, Activity, TrendingUp, MousePointer } from 'lucide-react'
import type { DateRange } from '@/types'

interface WebsiteTabProps {
  clientId: string
  dateRange: DateRange
  locationId?: string
  locationName?: string
}

export const WebsiteTab = ({ clientId, dateRange, locationId, locationName }: WebsiteTabProps) => {
  const { data, isLoading, error, refetch } = useWebsite(clientId, dateRange, locationId)

  if (isLoading) return <LoadingState message="Loading website data..." />
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />
  if (!data) return null
  if (!data.hasIntegration) return <NoIntegration service="Google Analytics (GA4)" />

  return (
    <div className="space-y-5 animate-fade-in">
      {locationName && (
        <div className="flex items-center gap-2 px-3 py-2 bg-brand-50 rounded-lg border border-brand-100 w-fit">
          <Globe size={13} className="text-brand-500" />
          <span className="text-xs font-medium text-brand-700">{locationName}</span>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Form Leads" value={formatNumber(data.formLeads)} color="text-emerald-600" icon={<TrendingUp size={16} />} />
        <StatCard label="Organic Sessions" value={formatNumber(data.organicSessions)} color="text-blue-600" icon={<Globe size={16} />} />
        <StatCard label="Engaged Sessions" value={formatNumber(data.engagedSessions)} color="text-brand-600" icon={<Activity size={16} />} />
        <StatCard label="30-day Active Users" value={formatNumber(data.activeUsers30d)} color="text-purple-600" icon={<Users size={16} />} />
        <StatCard label="Lead Conv Rate" value={formatPercent(data.leadConvRate, 2)} color="text-amber-600" icon={<MousePointer size={16} />} />
      </div>

      {/* Landing pages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Landing Pages</CardTitle>
            <ExportButton data={data.landingPages} filename="website-landing-pages" />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th>#</Th><Th>Landing Page</Th><Th>Sessions</Th>
                <Th>30-day Active Users</Th><Th>Leads</Th>
                <Th>Lead Conv Rate %</Th><Th>Bounce Rate</Th>
              </tr>
            </thead>
            <tbody>
              {data.landingPages.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-sm text-slate-400">No landing page data</td></tr>
              ) : data.landingPages.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <Td className="text-slate-400 text-xs">{i + 1}</Td>
                  <Td className="font-mono text-xs text-slate-700 max-w-[200px] truncate" title={row.landingPage}>{row.landingPage}</Td>
                  <Td>{formatNumber(row.sessions)}</Td>
                  <Td>{formatNumber(row.activeUsers30d)}</Td>
                  <Td className="font-semibold text-emerald-600">{formatNumber(row.leads)}</Td>
                  <Td>{formatPercent(row.leadConvRate, 2)}</Td>
                  <Td className={row.bounceRate > 80 ? 'text-red-500' : 'text-slate-700'}>{formatPercent(row.bounceRate, 2)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Channel performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Channel Performance Table</CardTitle>
            <ExportButton data={data.channelPerformance} filename="website-channel-performance" />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th>#</Th><Th>Channel Group</Th><Th>Device</Th>
                <Th>Sessions</Th><Th>30-day Active Users</Th><Th>Leads</Th>
              </tr>
            </thead>
            <tbody>
              {data.channelPerformance.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <Td className="text-slate-400 text-xs">{i + 1}</Td>
                  <Td className="font-medium">{row.channelGroup.replace(/_/g, ' ')}</Td>
                  <Td className="capitalize">{row.deviceCategory}</Td>
                  <Td>{formatNumber(row.sessions)}</Td>
                  <Td>{formatNumber(row.activeUsers30d)}</Td>
                  <Td className="font-semibold text-emerald-600">{formatNumber(row.leads)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
