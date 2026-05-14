'use client'
import { RefreshCw, Calendar } from 'lucide-react'
import { Button } from '@/components/ui'
import type { DateRange } from '@/types'

interface HeaderProps {
  title: string
  subtitle?: string
  dateRange: DateRange
  onDateChange: (range: DateRange) => void
  onSync?: () => void
  syncing?: boolean
  lastSync?: string
}

export const Header = ({ title, subtitle, dateRange, onDateChange, onSync, syncing }: HeaderProps) => (
  <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
    <div>
      <h1 className="text-lg font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>

    <div className="flex items-center gap-2.5">
      {/* Date range */}
      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
        <Calendar size={13} className="text-slate-400" />
        <input
          type="date"
          value={dateRange.startDate}
          onChange={e => onDateChange({ ...dateRange, startDate: e.target.value })}
          className="text-xs text-slate-600 bg-transparent border-none outline-none w-28"
        />
        <span className="text-slate-300 text-xs">→</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={e => onDateChange({ ...dateRange, endDate: e.target.value })}
          className="text-xs text-slate-600 bg-transparent border-none outline-none w-28"
        />
      </div>

      {onSync && (
        <Button variant="secondary" size="sm" onClick={onSync} loading={syncing}>
          <RefreshCw size={13} />
          Sync
        </Button>
      )}
    </div>
  </header>
)
