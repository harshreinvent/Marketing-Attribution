'use client'
import { StatCard, Card, CardHeader, CardTitle, CardContent, Table, Th, Td, LoadingState, ErrorState } from '@/components/ui'
import { DonutChart, FunnelBarChart, PieLegend } from '@/components/charts'
import { ExportButton } from '@/components/common/ExportButton'
import { useFunnelRoi } from '@/hooks/useDashboard'
import { formatNumber, formatPercent } from '@/lib/utils'
import { Users, PhoneCall, Calendar, Clock, AlertCircle } from 'lucide-react'
import type { DateRange } from '@/types'

export const FunnelRoiTab = ({ clientId, dateRange }: { clientId: string; dateRange: DateRange }) => {
  const { data, isLoading, error, refetch } = useFunnelRoi(clientId, dateRange)

  if (isLoading) return <LoadingState message="Loading funnel data..." />
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />
  if (!data) return null

  const pieData = data.channelGroupPie.map(c => ({ name: c.channelGroup, value: c.leads, percent: c.percentage }))

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total Leads" value={formatNumber(data.totalLeads)} icon={<Users size={16} />} />
        <StatCard label="Leads Received" value={formatNumber(data.leadsReceived)} color="text-blue-600" icon={<PhoneCall size={16} />} />
        <StatCard label="Appt Confirmed" value={formatNumber(data.appointmentsConfirmed)} color="text-emerald-600" icon={<Calendar size={16} />} />
        <StatCard label="2nd Consultations" value={formatNumber(data.secondConsultations)} color="text-purple-600" icon={<Clock size={16} />} />
        <StatCard label="Not Contacted" value={formatNumber(data.notContacted)} color="text-red-500" icon={<AlertCircle size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Funnel table + bar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Funnel Table</CardTitle>
              <ExportButton data={data.funnelTable} filename="funnel-table" />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr><Th>#</Th><Th>Stage Name</Th><Th>Total Records</Th></tr>
              </thead>
              <tbody>
                {data.funnelTable.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <Td className="text-slate-400 text-xs">{i + 1}</Td>
                    <Td className="font-medium capitalize">{row.stageName.replace(/_/g, ' ').toLowerCase()}</Td>
                    <Td className="font-semibold text-slate-900">{formatNumber(row.totalRecords)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <CardContent className="pt-0">
            <p className="text-xs font-medium text-slate-500 mb-3 mt-4">Funnel Bar</p>
            <FunnelBarChart data={data.funnelTable} height={180} />
          </CardContent>
        </Card>

        {/* Channel group pie */}
        <Card>
          <CardHeader><CardTitle>Channel Group by Total Leads</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-48 flex-shrink-0"><DonutChart data={pieData} /></div>
              <div className="flex-1 w-full"><PieLegend data={pieData} /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Source Table</CardTitle>
            <ExportButton data={data.sourceTable} filename="funnel-source-table" />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr><Th>#</Th><Th>Source</Th><Th>Pipeline Stage</Th><Th>Leads</Th><Th>Campaigns</Th></tr>
            </thead>
            <tbody>
              {data.sourceTable.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <Td className="text-slate-400 text-xs">{i + 1}</Td>
                  <Td className="font-medium capitalize">{row.source.replace(/_/g, ' ').toLowerCase()}</Td>
                  <Td className="capitalize">{row.pipelineStageName.replace(/_/g, ' ').toLowerCase()}</Td>
                  <Td className="font-semibold">{formatNumber(row.leads)}</Td>
                  <Td>{row.campaigns}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Campaign performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campaign Performance</CardTitle>
              <ExportButton data={data.campaignPerformance} filename="campaign-performance" />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr><Th>#</Th><Th>Channel</Th><Th>Campaign</Th><Th>Medium</Th><Th>Total Leads</Th></tr>
              </thead>
              <tbody>
                {data.campaignPerformance.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <Td className="text-slate-400 text-xs">{i + 1}</Td>
                    <Td className="text-xs">{row.channelGroup}</Td>
                    <Td className="font-medium max-w-[140px] truncate" title={row.campaign}>{row.campaign}</Td>
                    <Td className="text-xs text-slate-500">{row.medium}</Td>
                    <Td className="font-semibold text-emerald-600">{formatNumber(row.totalLeads)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* ROI Blend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ROI Blend</CardTitle>
              <ExportButton data={data.roiBlend} filename="roi-blend" />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr><Th>#</Th><Th>Source</Th><Th>Pipeline Leads</Th><Th>Total Contacts</Th></tr>
              </thead>
              <tbody>
                {data.roiBlend.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <Td className="text-slate-400 text-xs">{i + 1}</Td>
                    <Td className="font-medium capitalize">{row.source.replace(/_/g, ' ').toLowerCase()}</Td>
                    <Td className="font-semibold">{formatNumber(row.pipelineLeads)}</Td>
                    <Td>{formatNumber(row.totalContacts)}</Td>
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
