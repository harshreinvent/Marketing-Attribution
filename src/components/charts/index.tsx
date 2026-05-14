'use client'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar, AreaChart, Area
} from 'recharts'
import { PIE_COLORS, formatNumber } from '@/lib/utils'

// ─── Donut / Pie ──────────────────────────────────────────────────────

interface PieData { name: string; value: number; percent?: number }

export const DonutChart = ({ data, height = 220 }: { data: PieData[]; height?: number }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
        {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
      </Pie>
      <Tooltip
        formatter={(v: number) => [formatNumber(v), 'Leads']}
        contentStyle={{ borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }}
      />
    </PieChart>
  </ResponsiveContainer>
)

// ─── Lead Trend (area) ────────────────────────────────────────────────

interface LineData { date: string; leads: number }

export const LeadTrendChart = ({ data, height = 200 }: { data: LineData[]; height?: number }) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#5563f8" stopOpacity={0.15} />
          <stop offset="95%" stopColor="#5563f8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }}
        tickFormatter={d => { const dt = new Date(d); return `${dt.getDate()} ${dt.toLocaleString('default', { month: 'short' })}` }}
        interval="preserveStartEnd"
      />
      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatNumber} />
      <Tooltip
        formatter={(v: number) => [formatNumber(v), 'Total Leads']}
        labelFormatter={l => new Date(l).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        contentStyle={{ borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }}
      />
      <Area type="monotone" dataKey="leads" stroke="#5563f8" strokeWidth={2} fill="url(#leadGrad)" dot={false} />
    </AreaChart>
  </ResponsiveContainer>
)

// ─── CTR Line Chart (from old setup) ─────────────────────────────────

interface CTRData { date: string; ctr: number }

export const CTRLineChart = ({ data, height = 200 }: { data: CTRData[]; height?: number }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${(v * 100).toFixed(1)}%`} />
      <Tooltip
        formatter={(v: number) => [`${(v * 100).toFixed(2)}%`, 'CTR']}
        contentStyle={{ borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }}
      />
      <Line type="monotone" dataKey="ctr" stroke="#f59e0b" strokeWidth={2} name="CTR" dot={false} />
    </LineChart>
  </ResponsiveContainer>
)

// ─── Location Bar Chart (from old setup) ─────────────────────────────

interface LocationData { location: string; value: number }

export const LocationBarChart = ({ data, label = 'CPL', height = 240 }: { data: LocationData[]; label?: string; height?: number }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="location" tick={{ fontSize: 10, fill: '#94a3b8' }} />
      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatNumber} />
      <Tooltip
        formatter={(v: number) => [formatNumber(v), label]}
        contentStyle={{ borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }}
      />
      <Bar dataKey="value" fill="#10b981" name={label} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)

// ─── Funnel Bar Chart ─────────────────────────────────────────────────

interface FunnelData { stageName: string; totalRecords: number }

export const FunnelBarChart = ({ data, height = 220 }: { data: FunnelData[]; height?: number }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
      <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
      <YAxis type="category" dataKey="stageName" tick={{ fontSize: 10, fill: '#64748b' }} width={120} />
      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }} />
      <Bar dataKey="totalRecords" fill="#5563f8" radius={[0, 4, 4, 0]} />
    </BarChart>
  </ResponsiveContainer>
)

// ─── Multi-line chart ─────────────────────────────────────────────────

export const MultiLineChart = ({ data, lines, height = 220 }: {
  data: Record<string, number | string>[]
  lines: { key: string; color: string; name: string }[]
  height?: number
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} interval="preserveStartEnd"
        tickFormatter={d => { const dt = new Date(d); return `${dt.getDate()} ${dt.toLocaleString('default', { month: 'short' })}` }}
      />
      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatNumber} />
      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }} />
      <Legend wrapperStyle={{ fontSize: 11 }} />
      {lines.map(l => (
        <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={false} />
      ))}
    </LineChart>
  </ResponsiveContainer>
)

// ─── Pie Legend ───────────────────────────────────────────────────────

export const PieLegend = ({ data }: { data: { name: string; value: number; percent?: number }[] }) => (
  <div className="space-y-1.5 mt-3">
    {data.slice(0, 6).map((item, i) => (
      <div key={i} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
          <span className="text-xs text-slate-600 truncate capitalize">{item.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-semibold text-slate-800">{formatNumber(item.value)}</span>
          {item.percent !== undefined && <span className="text-xs text-slate-400">{item.percent.toFixed(1)}%</span>}
        </div>
      </div>
    ))}
  </div>
)
