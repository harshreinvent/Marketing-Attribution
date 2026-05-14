'use client'
import { StatCard, Card, CardHeader, CardTitle, Table, Th, Td, LoadingState, ErrorState, NoIntegration } from '@/components/ui'
import { LocationBarChart } from '@/components/charts'
import { ExportButton } from '@/components/common/ExportButton'
import { useMetaAds } from '@/hooks/useDashboard'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import { DollarSign, Eye, MousePointer, Target, Users, TrendingUp } from 'lucide-react'
import type { DateRange } from '@/types'

export const MetaAdsTab = ({ clientId, dateRange }: { clientId: string; dateRange: DateRange }) => {
  const { data, isLoading, error, refetch } = useMetaAds(clientId, dateRange)

  if (isLoading) return <LoadingState message="Loading Meta Ads data..." />
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />
  if (!data) return null
  if (!data.hasIntegration) return <NoIntegration service="Meta Ads" />

  const locationChartData = data.locations.map(l => ({
    location: l.adsetName,
    value: l.spend,
  }))

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Meta Spend" value={formatCurrency(data.metaSpend)} color="text-slate-800" icon={<DollarSign size={16} />} />
        <StatCard label="Impressions" value={formatNumber(data.impressions)} color="text-blue-600" icon={<Eye size={16} />} />
        <StatCard label="Clicks" value={formatNumber(data.clicks)} color="text-brand-600" icon={<MousePointer size={16} />} />
        <StatCard label="CTR %" value={formatPercent(data.ctr, 2)} color="text-purple-600" icon={<Target size={16} />} />
        <StatCard label="CPL" value={formatCurrency(data.cpl)} color="text-amber-600" icon={<TrendingUp size={16} />} />
        <StatCard label="Leads" value={formatNumber(data.leads)} color="text-emerald-600" icon={<Users size={16} />} />
      </div>

      {/* Campaigns table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaigns Table</CardTitle>
            <ExportButton data={data.campaigns} filename="meta-ads-campaigns" />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th>#</Th><Th>Campaign Name</Th><Th>Spend (₹)</Th>
                <Th>Impressions</Th><Th>Clicks</Th><Th>CPC (₹)</Th><Th>CPL (₹)</Th>
              </tr>
            </thead>
            <tbody>
              {data.campaigns.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-sm text-slate-400">No campaign data</td></tr>
              ) : data.campaigns.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <Td className="text-slate-400 text-xs">{i + 1}</Td>
                  <Td className="font-medium max-w-[180px] truncate text-slate-800" title={row.campaignName}>{row.campaignName}</Td>
                  <Td className="font-semibold">{formatCurrency(row.spend)}</Td>
                  <Td>{formatNumber(row.impressions)}</Td>
                  <Td>{formatNumber(row.clicks)}</Td>
                  <Td>{formatCurrency(row.cpc)}</Td>
                  <Td>{formatCurrency(row.cpl)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Location spend chart + table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Location Table</CardTitle>
              <ExportButton data={data.locations} filename="meta-ads-locations" />
            </div>
          </CardHeader>
          {locationChartData.length > 0 && (
            <div className="px-5 pt-2">
              <LocationBarChart data={locationChartData} label="Spend (₹)" />
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <Th>#</Th><Th>Adset / Location</Th><Th>Spend</Th>
                  <Th>Impressions</Th><Th>Clicks</Th><Th>CTR</Th><Th>Cost/Msg</Th>
                </tr>
              </thead>
              <tbody>
                {data.locations.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <Td className="text-slate-400 text-xs">{i + 1}</Td>
                    <Td className="font-medium">{row.adsetName}</Td>
                    <Td>{formatCurrency(row.spend)}</Td>
                    <Td>{formatNumber(row.impressions)}</Td>
                    <Td>{formatNumber(row.clicks)}</Td>
                    <Td>{formatPercent(row.ctr, 2)}</Td>
                    <Td>{formatCurrency(row.costPerMessage)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Ads table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ads Table</CardTitle>
              <ExportButton data={data.ads} filename="meta-ads-creatives" />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <Th>#</Th><Th>Ad Name</Th><Th>Spend</Th>
                  <Th>Clicks</Th><Th>CTR</Th><Th>Cost/Click</Th><Th>Engagement</Th>
                </tr>
              </thead>
              <tbody>
                {data.ads.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <Td className="text-slate-400 text-xs">{i + 1}</Td>
                    <Td className="font-medium">{row.adName}</Td>
                    <Td>{formatCurrency(row.spend)}</Td>
                    <Td>{formatNumber(row.clicks)}</Td>
                    <Td>{formatPercent(row.ctr, 2)}</Td>
                    <Td>{formatCurrency(row.costPerLinkClick)}</Td>
                    <Td>{formatNumber(row.postEngagement)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
