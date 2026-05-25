import type { OnboardingData } from '@/app/(admin)/admin/clients/new/page'
import { TrendingUp, Zap, Globe, MapPin, MessageCircle, Search } from 'lucide-react'

type Props = {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const ALL_SERVICES = [
  { value: 'GOOGLE_ADS',      label: 'Google Ads',       desc: 'Paid search & display campaigns',  icon: <TrendingUp size={18} />, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
  { value: 'META_ADS',        label: 'Meta Ads',         desc: 'Facebook & Instagram ads',         icon: <Zap size={18} />,        color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { value: 'WEBSITE_ORGANIC', label: 'Website / Organic',desc: 'GA4 organic traffic tracking',     icon: <Globe size={18} />,      color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200'},
  { value: 'GMB',             label: 'Google Business',  desc: 'GMB listing performance',          icon: <MapPin size={18} />,     color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { value: 'WHATSAPP',        label: 'WhatsApp',         desc: 'WhatsApp lead tracking',           icon: <MessageCircle size={18} />, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { value: 'SEO',             label: 'SEO',              desc: 'Search engine optimization',       icon: <Search size={18} />,     color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200'   },
]

export function StepServices({ data, update, onNext, onBack }: Props) {
  const toggle = (value: string) => {
    const current = data.services
    const updated = current.includes(value)
      ? current.filter(s => s !== value)
      : [...current, value]
    update({ services: updated })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Active Services</h2>
        <p className="text-xs text-slate-400 mt-0.5">Select which marketing channels this client is running</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_SERVICES.map(s => {
          const selected = data.services.includes(s.value)
          return (
            <button
              key={s.value}
              onClick={() => toggle(s.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                selected
                  ? `${s.border} ${s.bg}`
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? s.bg : 'bg-slate-100'}`}>
                <span className={selected ? s.color : 'text-slate-400'}>{s.icon}</span>
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${selected ? 'text-slate-900' : 'text-slate-600'}`}>{s.label}</p>
                <p className="text-xs text-slate-400 truncate">{s.desc}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ml-auto flex-shrink-0 flex items-center justify-center ${
                selected ? `${s.border} ${s.bg}` : 'border-slate-300'
              }`}>
                {selected && <div className={`w-2 h-2 rounded-full ${s.color.replace('text-', 'bg-')}`} />}
              </div>
            </button>
          )
        })}
      </div>

      {data.services.length === 0 && (
        <p className="text-xs text-amber-600 mt-3">Select at least one service</p>
      )}

      <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
        <button onClick={onBack} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={data.services.length === 0}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}