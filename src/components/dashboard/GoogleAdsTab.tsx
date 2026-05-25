'use client'
import { StatCard, Card, CardHeader, CardTitle, Table, Th, Td, LoadingState, ErrorState, NoIntegration } from '@/components/ui'
import { MetricLineChart } from '@/components/charts'
import { ExportButton } from '@/components/common/ExportButton'
import { useGoogleAds } from '@/hooks/useDashboard'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import { DollarSign, Eye, MousePointer, TrendingUp, Target, BarChart2 } from 'lucide-react'
import type { DateRange } from '@/types'

export const GoogleAdsTab = ({ clientId, dateRange }: { clientId: string; dateRange: DateRange }) => {
  const { data, isLoading, error, refetch } = useGoogleAds(clientId, dateRange)

  if (isLoading) return <LoadingState message="Loading Google Ads data..." />
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />
  if (!data) return null
  if (!data.hasIntegration) return <NoIntegration service="Google Ads" />

  // Build trend data from campaigns (each campaign = one data point)
  // When backend adds dailyTrend array, replace this with: data.dailyTrend
  const trendData = data.campaigns.map((c, i) => ({
    date: `Camp ${i + 1}`,
    clicks: c.clicks,
    impressions: c.impressions,
  }))

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPIs row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Cost" value={formatCurrency(data.cost)} color="text-slate-800" icon={<DollarSign size={16} />} />
        <StatCard label="Impressions" value={formatNumber(data.impressions)} color="text-blue-600" icon={<Eye size={16} />} />
        <StatCard label="Clicks" value={formatNumber(data.clicks)} color="text-brand-600" icon={<MousePointer size={16} />} />
        <StatCard label="CTR %" value={formatPercent(data.ctr, 2)} color="text-purple-600" icon={<Target size={16} />} />
        <StatCard label="Avg CPC" value={formatCurrency(data.avgCpc)} color="text-amber-600" icon={<TrendingUp size={16} />} />
      </div>

      {/* KPIs row 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard label="Conversions" value={formatNumber(data.conversions)} color="text-emerald-600" icon={<BarChart2 size={16} />} />
        <StatCard label="Cost/Conversion" value={formatCurrency(data.costPerConversion)} color="text-amber-600" />
        <StatCard label="CPM" value={formatCurrency(data.cpm)} color="text-slate-600" />
        <StatCard label="True ROI %" value={`${data.trueRoi}%`} color={data.trueRoi >= 0 ? 'text-emerald-600' : 'text-red-500'} />
      </div>

      {/* Campaign table — fixed header, scrollable rows */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaign Performance</CardTitle>
            <ExportButton data={data.campaigns} filename="google-ads-campaigns" />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-slate-100">
                <Th>#</Th>
                <Th>Campaign Name</Th>
                <Th>Spend (₹)</Th>
                <Th>Impressions</Th>
                <Th>Clicks</Th>
                <Th>Conversions</Th>
                <Th>CPA (₹)</Th>
                <Th>ROAS</Th>
              </tr>
            </thead>
          </table>
          <div className="overflow-y-auto max-h-[320px] hide-scrollbar">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {data.campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-sm text-slate-400">
                      No campaign data for this period
                    </td>
                  </tr>
                ) : data.campaigns.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <Td className="text-slate-400 text-xs">{i + 1}</Td>
                    <Td className="font-medium max-w-[200px] truncate text-slate-800" title={row.campaignName}>{row.campaignName}</Td>
                    <Td className="font-semibold">{formatCurrency(row.spend)}</Td>
                    <Td>{formatNumber(row.impressions)}</Td>
                    <Td>{formatNumber(row.clicks)}</Td>
                    <Td>{formatNumber(row.conversions)}</Td>
                    <Td>{row.cpa ? formatCurrency(row.cpa) : <span className="text-slate-300">—</span>}</Td>
                    <Td>{row.roas || <span className="text-slate-300">0</span>}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Clicks & Impressions trend chart */}
      <Card>
        <CardHeader>
          <CardTitle>Clicks & Impressions Trend</CardTitle>
        </CardHeader>
        <div className="px-4 pb-4">
          <MetricLineChart
            title="Google Ads — Clicks & Impressions"
            data={trendData}
            lines={[
              { key: 'clicks',      name: 'Clicks',      color: '#5563f8' },
              { key: 'impressions', name: 'Impressions',  color: '#f59e0b' },
            ]}
            height={240}
          />
        </div>
      </Card>
    </div>
  )
}