'use client'
import { useState } from 'react'
import {
  StatCard, Card, CardHeader, CardTitle, CardContent,
  LoadingState, ErrorState, NoIntegration, Th, Td,
} from '@/components/ui'
import { ExportButton } from '@/components/common/ExportButton'
import { useGoogleAds } from '@/hooks/useDashboard'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import {
  DollarSign, Eye, MousePointer, TrendingUp, Target,
  BarChart2, Layers, Monitor,
} from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts'
import type { DateRange } from '@/types'

// ─── Colors ──────────────────────────────────────────────────────────
const DEVICE_COLORS: Record<string, string> = {
  MOBILE:  '#3b82f6',
  DESKTOP: '#f97316',
  TABLET:  '#10b981',
  OTHER:   '#94a3b8',
}
const HEATMAP_MAX_COLOR = '#1d4ed8'
const TREND_COLORS = { clicks: '#3b82f6', impressions: '#f59e0b', spend: '#10b981', conversions: '#a855f7' }

// ─── Section Title ────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm font-semibold text-brand-600 text-center mb-4">{children}</p>
)

// ─── Pagination ───────────────────────────────────────────────────────
const Pagination = ({ page, total, pageSize, onPage }: {
  page: number; total: number; pageSize: number; onPage: (p: number) => void
}) => {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-slate-100 text-xs text-slate-500">
      <span>{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} / {total}</span>
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30">‹</button>
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30">›</button>
    </div>
  )
}

// ─── Hourly heatmap ───────────────────────────────────────────────────
const HourlyHeatmap = ({ data }: { data: { hour: number; label: string; clicks: number }[] }) => {
  const maxClicks = Math.max(...data.map(d => d.clicks), 1)
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-1">
        {data.map(d => {
          const intensity = d.clicks / maxClicks
          const bg = intensity === 0
            ? '#f1f5f9'
            : `rgba(29,78,216,${Math.max(0.08, intensity)})`
          return (
            <div key={d.hour} className="group relative">
              <div
                className="h-8 rounded cursor-pointer transition-all hover:ring-2 hover:ring-blue-400"
                style={{ backgroundColor: bg }}
                title={`${d.label}: ${d.clicks} clicks`}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block
                bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {d.label}<br />{formatNumber(d.clicks)} clicks
              </div>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-12 gap-1">
        {data.map(d => (
          <div key={d.hour} className="text-center text-xs text-slate-400">
            {d.hour % 3 === 0 ? d.hour : ''}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-slate-400">Low</span>
        <div className="flex gap-0.5">
          {[0.08, 0.2, 0.4, 0.6, 0.8, 1].map(v => (
            <div key={v} className="w-4 h-3 rounded-sm" style={{ backgroundColor: `rgba(29,78,216,${v})` }} />
          ))}
        </div>
        <span className="text-xs text-slate-400">High</span>
      </div>
    </div>
  )
}

// ─── Main Tab ─────────────────────────────────────────────────────────
export const GoogleAdsTab = ({ clientId, dateRange }: { clientId: string; dateRange: DateRange }) => {
  const { data, isLoading, error, refetch } = useGoogleAds(clientId, dateRange)
  const [campPage, setCampPage]   = useState(1)
  const [agPage,   setAgPage]     = useState(1)
  const [activeTrend, setActiveTrend] = useState<'clicks' | 'impressions' | 'spend'>('clicks')
  const PAGE = 5

  if (isLoading) return <LoadingState message="Loading Google Ads data..." />
  if (error)     return <ErrorState message={(error as Error).message} onRetry={refetch} />
  if (!data)     return null
  if (!data.hasIntegration) return <NoIntegration service="Google Ads" />

  const pagedCampaigns = data.campaigns.slice((campPage - 1) * PAGE, campPage * PAGE)
  const pagedAdGroups  = data.adGroups.slice((agPage - 1) * PAGE, agPage * PAGE)

  // Device pie data
  const devicePieData = data.deviceBreakdown.map(d => ({
    name:  d.device,
    value: d.clicks,
  }))

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── KPI Row 1 ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Cost"        value={formatCurrency(data.cost)}        color="text-slate-800"   icon={<DollarSign size={16} />} />
        <StatCard label="Impressions" value={formatNumber(data.impressions)}    color="text-blue-600"   icon={<Eye size={16} />} />
        <StatCard label="Clicks"      value={formatNumber(data.clicks)}         color="text-brand-600"  icon={<MousePointer size={16} />} />
        <StatCard label="CTR %"       value={formatPercent(data.ctr, 2)}        color="text-purple-600" icon={<Target size={16} />} />
        <StatCard label="Avg CPC"     value={formatCurrency(data.avgCpc)}       color="text-amber-600"  icon={<TrendingUp size={16} />} />
      </div>

      {/* ── KPI Row 2 ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard label="Conversions"      value={formatNumber(data.conversions)}           color="text-emerald-600" icon={<BarChart2 size={16} />} />
        <StatCard label="Cost/Conversion"  value={formatCurrency(data.costPerConversion)}   color="text-amber-600" />
        <StatCard label="CPM"              value={formatCurrency(data.cpm)}                 color="text-slate-600" />
        <StatCard label="True ROI %"       value={`${data.trueRoi}%`}                       color={data.trueRoi >= 0 ? 'text-emerald-600' : 'text-red-500'} />
      </div>

      {/* ── Daily Trend ───────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Daily Performance Trend</SectionTitle>
            <div className="flex gap-1">
              {(['clicks', 'impressions', 'spend'] as const).map(k => (
                <button key={k} onClick={() => setActiveTrend(k)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${activeTrend === k
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.dailyTrend} margin={{ top: 5, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} interval="preserveStartEnd"
                tickFormatter={d => { const dt = new Date(d); return `${dt.toLocaleString('default', { month: 'short' })} ${dt.getDate()}` }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={v => activeTrend === 'spend' ? `₹${formatNumber(v)}` : formatNumber(v)} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }}
                labelFormatter={l => new Date(l).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                formatter={(v: number) => activeTrend === 'spend' ? formatCurrency(v) : formatNumber(v)} />
              <Line type="monotone" dataKey={activeTrend} stroke={TREND_COLORS[activeTrend]}
                strokeWidth={2.5} dot={false} name={activeTrend.charAt(0).toUpperCase() + activeTrend.slice(1)} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Campaign Table ────────────────────────────────────── */}
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
            <tbody>
              {pagedCampaigns.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-sm text-slate-400">No campaign data for this period</td></tr>
              ) : pagedCampaigns.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                  <Td className="text-slate-400 text-xs">{(campPage - 1) * PAGE + i + 1}</Td>
                  <Td className="font-medium max-w-[220px] truncate text-slate-800" title={row.campaignName}>{row.campaignName}</Td>
                  <Td className="font-semibold">{formatCurrency(row.spend)}</Td>
                  <Td>{formatNumber(row.impressions)}</Td>
                  <Td>{formatNumber(row.clicks)}</Td>
                  <Td>{formatNumber(row.conversions)}</Td>
                  <Td>{row.cpa ? formatCurrency(row.cpa) : <span className="text-slate-300">—</span>}</Td>
                  <Td>{row.roas > 0 ? row.roas.toFixed(2) : <span className="text-slate-300">—</span>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={campPage} total={data.campaigns.length} pageSize={PAGE} onPage={setCampPage} />
      </Card>

      {/* ── Ad Group Table ────────────────────────────────────── */}
      {data.adGroups.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle><Layers size={16} className="inline mr-2 text-brand-600" />Ad Group Performance</CardTitle>
              <ExportButton data={data.adGroups} filename="google-ads-adgroups" />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-100">
                  <Th>#</Th>
                  <Th>Ad Group</Th>
                  <Th>Campaign</Th>
                  <Th>Spend (₹)</Th>
                  <Th>Impressions</Th>
                  <Th>Clicks</Th>
                  <Th>CTR %</Th>
                  <Th>CPC (₹)</Th>
                  <Th>Conversions</Th>
                  <Th>CPA (₹)</Th>
                </tr>
              </thead>
              <tbody>
                {pagedAdGroups.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <Td className="text-slate-400 text-xs">{(agPage - 1) * PAGE + i + 1}</Td>
                    <Td className="font-medium max-w-[180px] truncate text-slate-800" title={row.adGroupName}>{row.adGroupName}</Td>
                    <Td className="text-slate-500 max-w-[160px] truncate text-xs" title={row.campaignName}>{row.campaignName}</Td>
                    <Td className="font-semibold">{formatCurrency(row.spend)}</Td>
                    <Td>{formatNumber(row.impressions)}</Td>
                    <Td>{formatNumber(row.clicks)}</Td>
                    <Td>{formatPercent(row.ctr, 2)}</Td>
                    <Td>{row.cpc ? formatCurrency(row.cpc) : <span className="text-slate-300">—</span>}</Td>
                    <Td>{formatNumber(row.conversions)}</Td>
                    <Td>{row.cpa ? formatCurrency(row.cpa) : <span className="text-slate-300">—</span>}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={agPage} total={data.adGroups.length} pageSize={PAGE} onPage={setAgPage} />
        </Card>
      )}

      {/* ── Device Split + Hourly Heatmap ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Device split */}
        <Card>
          <CardContent className="pt-4">
            <SectionTitle>Device Split</SectionTitle>
            {data.deviceBreakdown.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-slate-400">No device data</div>
            ) : (
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="w-44 h-44 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={devicePieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68}
                        paddingAngle={3} dataKey="value">
                        {devicePieData.map((entry, i) => (
                          <Cell key={i} fill={DEVICE_COLORS[entry.name] || '#94a3b8'} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [formatNumber(v), 'Clicks']}
                        contentStyle={{ borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                  {data.deviceBreakdown.map((d, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[d.device] || '#94a3b8' }} />
                          <span className="text-slate-600 capitalize">{d.device.toLowerCase()}</span>
                        </div>
                        <div className="flex gap-3 text-slate-700">
                          <span>{formatNumber(d.clicks)} clicks</span>
                          <span className="text-slate-400">{formatPercent(d.ctr, 2)}</span>
                          <span className="font-medium">{formatCurrency(d.spend)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${(d.clicks / Math.max(...data.deviceBreakdown.map(x => x.clicks), 1)) * 100}%`,
                            backgroundColor: DEVICE_COLORS[d.device] || '#94a3b8',
                          }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hourly heatmap */}
        <Card>
          <CardContent className="pt-4">
            <SectionTitle>Clicks by Hour of Day</SectionTitle>
            {data.hourlyHeatmap.every(h => h.clicks === 0) ? (
              <div className="flex items-center justify-center h-40 text-sm text-slate-400">No hourly data</div>
            ) : (
              <HourlyHeatmap data={data.hourlyHeatmap} />
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}