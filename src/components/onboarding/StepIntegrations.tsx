import { useState } from 'react'
import type { OnboardingData } from '@/app/(admin)/admin/clients/new/page'
import { TrendingUp, Zap, Activity, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

type Props = {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const INTEGRATIONS = [
  {
    provider: 'GOOGLE_ADS',
    label: 'Google Ads',
    icon: <TrendingUp size={16} />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    fields: [
      { key: 'accountId',    label: 'Customer ID',    placeholder: '9235521644',  secret: false },
      { key: 'refreshToken', label: 'Refresh Token',  placeholder: 'OAuth refresh token', secret: true },
    ],
  },
  {
    provider: 'META_ADS',
    label: 'Meta Ads',
    icon: <Zap size={16} />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    fields: [
      { key: 'accountId',   label: 'Ad Account ID', placeholder: '4424299690',   secret: false },
      { key: 'accessToken', label: 'Access Token',  placeholder: 'Long-lived access token', secret: true },
    ],
  },
  {
    provider: 'GOOGLE_ANALYTICS',
    label: 'GA4',
    icon: <Activity size={16} />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    fields: [
      { key: 'accountId',   label: 'Property ID',   placeholder: '123456789',    secret: false },
      { key: 'accessToken', label: 'Access Token',  placeholder: 'OAuth access token', secret: true },
    ],
  },
]

export function StepIntegrations({ data, update, onNext, onBack }: Props) {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [openProvider, setOpenProvider] = useState<string | null>(null)

  const getIntegration = (provider: string) =>
    data.integrations.find(i => i.provider === provider)

  const updateIntegration = (provider: string, key: string, value: string) => {
    const existing = data.integrations.find(i => i.provider === provider)
    if (existing) {
      update({
        integrations: data.integrations.map(i =>
          i.provider === provider ? { ...i, [key]: value } : i
        ),
      })
    } else {
      update({
        integrations: [
          ...data.integrations,
          { provider, accountId: '', refreshToken: '', accessToken: '', extraConfig: {}, [key]: value },
        ],
      })
    }
  }

  const isConfigured = (provider: string) => {
    const integ = getIntegration(provider)
    if (!integ) return false
    const config = INTEGRATIONS.find(i => i.provider === provider)!
    return config.fields.every(f => (integ as any)[f.key]?.trim())
  }

  // Only show integrations for selected services
  const relevantIntegrations = INTEGRATIONS.filter(i => {
    if (i.provider === 'GOOGLE_ADS') return data.services.includes('GOOGLE_ADS')
    if (i.provider === 'META_ADS') return data.services.includes('META_ADS')
    if (i.provider === 'GOOGLE_ANALYTICS') return data.services.includes('WEBSITE_ORGANIC')
    return false
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Integrations</h2>
        <p className="text-xs text-slate-400 mt-0.5">Add API credentials for each active service</p>
      </div>

      {relevantIntegrations.length === 0 && (
        <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-sm text-slate-400">No integrations needed for selected services</p>
        </div>
      )}

      <div className="space-y-3">
        {relevantIntegrations.map(integ => {
          const configured = isConfigured(integ.provider)
          const open = openProvider === integ.provider
          const integration = getIntegration(integ.provider)

          return (
            <div key={integ.provider} className={`rounded-xl border-2 overflow-hidden transition-all ${
              configured ? 'border-emerald-200' : open ? integ.border : 'border-slate-200'
            }`}>
              {/* Header */}
              <button
                onClick={() => setOpenProvider(open ? null : integ.provider)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                  configured ? 'bg-emerald-50' : open ? integ.bg : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${integ.bg}`}>
                  <span className={integ.color}>{integ.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{integ.label}</p>
                  <p className="text-xs text-slate-400">
                    {configured ? 'Configured ✓' : 'Click to add credentials'}
                  </p>
                </div>
                {configured && <CheckCircle2 size={16} className="text-emerald-500" />}
              </button>

              {/* Fields */}
              {open && (
                <div className="p-4 bg-white border-t border-slate-100 space-y-3">
                  {integ.fields.map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-slate-700 mb-1">{field.label}</label>
                      <div className="relative">
                        <input
                          type={field.secret && !showSecrets[`${integ.provider}-${field.key}`] ? 'password' : 'text'}
                          value={(integration as any)?.[field.key] || ''}
                          onChange={e => updateIntegration(integ.provider, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 font-mono pr-10"
                        />
                        {field.secret && (
                          <button
                            onClick={() => setShowSecrets(p => ({ ...p, [`${integ.provider}-${field.key}`]: !p[`${integ.provider}-${field.key}`] }))}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showSecrets[`${integ.provider}-${field.key}`] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setOpenProvider(null)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
        <button onClick={onBack} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
          Back
        </button>
        <button onClick={onNext}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-colors">
          Continue
        </button>
      </div>
    </div>
  )
}