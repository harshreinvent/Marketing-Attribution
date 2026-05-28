'use client'
import { useExport } from '@/hooks/useExport'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  data: Record<string, unknown>[]
  filename: string
}

export const ExportButton = ({ data, filename }: ExportButtonProps) => {
  const { exportToCsv } = useExport()

  return (
    <button
      onClick={() => exportToCsv(data, filename)}
      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 border border-slate-200 hover:border-brand-300 rounded-lg px-2.5 py-1.5 transition-colors bg-white"
      title={`Export ${filename} as CSV`}
    >
      <Download size={12} />
      Export CSV
    </button>
  )
}
