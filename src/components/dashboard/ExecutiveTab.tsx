'use client'
import { StatCard, Card, CardHeader, CardTitle, CardContent, Table, Th, Td, Badge, LoadingState, ErrorState } from '@/components/ui'
import { DonutChart, LeadTrendChart, PieLegend } from '@/components/charts'
import { ExportButton } from '@/components/common/ExportButton'
import { useExecutiveSummary } from '@/hooks/useDashboard'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import { TrendingUp, Users, DollarSign, Calendar, Target, Activity } from 'lucide-react'
import type { DateRange } from '@/types'

export const ExecutiveTab = ({ clientId, dateRange }: { clientId: string; dateRange: DateRange }) => {
  const { data, isLoading, error, refetch } = useExecutiveSummary(clientId, dateRange)

  if (isLoading) return <LoadingState message="Loading executive summary..." />
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />
  if (!data) return null

  const pieData = data.channelMix.map(c => ({ name: c.source, value: c.leads, percent: c.percent }))

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard label="Total Leads" value={formatNumber(data.totalLeads)} icon={<Users size={16} />} />
        <StatCard label="Total Spend" value={formatCurrency(data.totalSpend)} color="text-slate-800" icon={<DollarSign size={16} />} />
        <StatCard label="Blended CPL" value={formatCurrency(data.blendedCpl)} color="text-amber-600" icon={<Target size={16} />} />
        <StatCard label="Appointments" value={formatNumber(data.appointmentsBooked)} color="text-emerald-600" icon={<Calendar size={16} />} />
        <StatCard label="Meta Leads" value={formatNumber(data.metaLeads)} color="text-blue-600" icon={<TrendingUp size={16} />} />
        <StatCard label="Meta CPL" value={formatCurrency(data.metaCpl)} color="text-purple-600" icon={<Activity size={16} />} />
        <StatCard label="Booking Rate" value={formatPercent(data.bookingRate)} color="text-emerald-600" icon={<Target size={16} />} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>Channel Mix — Leads by Source</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-48 flex-shrink-0">
                <DonutChart data={pieData} />
              </div>
              <div className="flex-1 w-full">
                <PieLegend data={pieData} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Channel Performance</CardTitle>
              <ExportButton data={data.channelPerformance} filename="channel-performance" />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <Th>Source</Th><Th>Leads</Th><Th>% of Total</Th>
                  <Th>Spend</Th><Th>CPL</Th><Th>Bookings</Th>
                </tr>
              </thead>
              <tbody>
                {data.channelPerformance.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <Td className="font-medium capitalize">{row.source}</Td>
                    <Td className="font-semibold text-slate-900">{formatNumber(row.leads)}</Td>
                    <Td>{formatPercent(row.percent)}</Td>
                    <Td>{row.spend ? formatCurrency(row.spend) : <span className="text-slate-300">—</span>}</Td>
                    <Td>{row.cpl ? formatCurrency(row.cpl) : <span className="text-slate-300">—</span>}</Td>
                    <Td>{row.bookings ?? <span className="text-slate-300">—</span>}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Daily trend */}
      <Card>
        <CardHeader><CardTitle>Daily Lead Trend</CardTitle></CardHeader>
        <CardContent><LeadTrendChart data={data.dailyLeadTrend} height={200} /></CardContent>
      </Card>

      {/* Funnel + conversion rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Funnel Snapshot</CardTitle>
              <ExportButton data={data.funnelSnapshot} filename="funnel-snapshot" />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <Th>#</Th><Th>Stage</Th><Th>Count</Th>
                  <Th>Drop from prev</Th><Th>Conv from Leads%</Th>
                </tr>
              </thead>
              <tbody>
                {data.funnelSnapshot.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <Td className="text-slate-400">{i + 1}</Td>
                    <Td className="font-medium capitalize">{row.stage.replace(/_/g, ' ').toLowerCase()}</Td>
                    <Td className="font-semibold text-slate-900">{row.count}</Td>
                    <Td>{row.dropFromPrev != null ? <span className="text-red-500">{formatPercent(row.dropFromPrev)}</span> : <span className="text-slate-300">—</span>}</Td>
                    <Td>{formatPercent(row.convFromLeads)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Stage Conversion Rates</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <Th>Transition</Th><Th>In</Th><Th>Out</Th>
                  <Th>Rate</Th><Th>Threshold</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {data.stageConversionRates.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <Td className="text-xs max-w-[160px] truncate">{row.transition}</Td>
                    <Td>{formatNumber(row.countIn)}</Td>
                    <Td>{formatNumber(row.countOut)}</Td>
                    <Td className="font-semibold">{formatPercent(row.rate)}</Td>
                    <Td className="text-slate-500">{row.threshold}%</Td>
                    <Td>
                      <Badge variant={row.status === 'GREEN' ? 'green' : row.status === 'RED' ? 'red' : 'yellow'}>
                        {row.status}
                      </Badge>
                    </Td>
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
