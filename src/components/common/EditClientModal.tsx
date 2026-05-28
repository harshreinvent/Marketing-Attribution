'use client'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clientsApi } from '@/lib/endpoints'
import { X, Building2, Layers, MapPin, Users, Plug, Loader2, Plus, Trash2, Eye, EyeOff, CheckCircle2, TrendingUp, Zap, Activity, Globe, MessageCircle, Search } from 'lucide-react'
import type { Client } from '@/types'

type Tab = 'basic' | 'services' | 'locations' | 'users' | 'integrations'

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'basic',        label: 'Basic Info',    icon: Building2  },
  { key: 'services',     label: 'Services',      icon: Layers     },
  { key: 'locations',    label: 'Locations',     icon: MapPin     },
  { key: 'users',        label: 'Users',         icon: Users      },
  { key: 'integrations', label: 'Integrations',  icon: Plug       },
]

const ALL_SERVICES = [
  { value: 'GOOGLE_ADS',      label: 'Google Ads',        icon: <TrendingUp size={14} />, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
  { value: 'META_ADS',        label: 'Meta Ads',          icon: <Zap size={14} />,        color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200'  },
  { value: 'WEBSITE_ORGANIC', label: 'Website / Organic', icon: <Activity size={14} />,  color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200'  },
  { value: 'GMB',             label: 'Google Business',   icon: <Globe size={14} />,      color: 'text-teal-600',    bg: 'bg-teal-50',    border: 'border-teal-200'    },
  { value: 'WHATSAPP',        label: 'WhatsApp',          icon: <MessageCircle size={14} />, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200'  },
  { value: 'SEO',             label: 'SEO',               icon: <Search size={14} />,     color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200'   },
]

const INTEGRATIONS_CONFIG = [
  { provider: 'GOOGLE_ADS',        label: 'Google Ads', fields: [{ key: 'accountId', label: 'Customer ID', secret: false }, { key: 'refreshToken', label: 'Refresh Token', secret: true }] },
  { provider: 'META_ADS',          label: 'Meta Ads',   fields: [{ key: 'accountId', label: 'Ad Account ID', secret: false }, { key: 'accessToken', label: 'Access Token', secret: true }] },
  { provider: 'GOOGLE_ANALYTICS',  label: 'GA4',        fields: [{ key: 'accountId', label: 'Property ID', secret: false }, { key: 'accessToken', label: 'Access Token', secret: true }] },
]

export function EditClientModal({ client, onClose, onSaved }: {
  client: Client
  onClose: () => void
  onSaved: () => void
}) {
  const [activeTab, setActiveTab] = useState<Tab>('basic')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <span className="text-sm font-bold text-brand-600">{client.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{client.name}</p>
              <p className="text-xs text-slate-400">Edit client settings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-5 flex-shrink-0 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'basic'        && <EditBasicInfo     client={client} onSaved={onSaved} />}
          {activeTab === 'services'     && <EditServices      client={client} onSaved={onSaved} />}
          {activeTab === 'locations'    && <EditLocations     client={client} />}
          {activeTab === 'users'        && <EditUsers         client={client} />}
          {activeTab === 'integrations' && <EditIntegrations  client={client} />}
        </div>
      </div>
    </div>
  )
}

// ─── Basic Info Tab ───────────────────────────────────────────────────

function EditBasicInfo({ client, onSaved }: { client: Client; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: client.name,
    industry: client.industry,
    websiteSplitByLocation: client.websiteSplitByLocation,
  })

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => clientsApi.update(client.id, form),
    onSuccess: onSaved,
  })

  return (
    <div className="p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Client Name</label>
        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Industry</label>
        <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 appearance-none">
          <option value="healthcare">Healthcare</option>
          <option value="dental">Dental</option>
          <option value="education">Education</option>
          <option value="real-estate">Real Estate</option>
          <option value="retail">Retail</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="text-sm font-medium text-slate-700">Split Website by Location</p>
          <p className="text-xs text-slate-400">Show separate website tab per branch</p>
        </div>
        <button
          onClick={() => setForm(p => ({ ...p, websiteSplitByLocation: !p.websiteSplitByLocation }))}
          className={`w-11 h-6 rounded-full transition-colors relative ${form.websiteSplitByLocation ? 'bg-brand-600' : 'bg-slate-300'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.websiteSplitByLocation ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      <div className="pt-2">
        <button onClick={() => save()} disabled={isPending}
          className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
          {isPending ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

// ─── Services Tab ─────────────────────────────────────────────────────

function EditServices({ client, onSaved }: { client: Client; onSaved: () => void }) {
  const currentServices = client.services?.map(s => s.service) || []
  const [selected, setSelected] = useState<string[]>(currentServices)

  const toggle = (value: string) => {
    setSelected(p => p.includes(value) ? p.filter(s => s !== value) : [...p, value])
  }

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => clientsApi.updateServices(client.id, selected),
    onSuccess: onSaved,
  })

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {ALL_SERVICES.map(s => {
          const isSelected = selected.includes(s.value)
          return (
            <button key={s.value} onClick={() => toggle(s.value)}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${isSelected ? `${s.border} ${s.bg}` : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <span className={isSelected ? s.color : 'text-slate-400'}>{s.icon}</span>
              <span className={`text-sm font-medium ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{s.label}</span>
              {isSelected && <CheckCircle2 size={14} className={`ml-auto ${s.color}`} />}
            </button>
          )
        })}
      </div>
      <button onClick={() => save()} disabled={isPending || selected.length === 0}
        className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
        {isPending ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Services'}
      </button>
    </div>
  )
}

// ─── Locations Tab ─────────────────────────────────────────────────────

function EditLocations({ client }: { client: Client }) {
  const qc = useQueryClient()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', address: '', trackingPhone: '', realPhone: '' })

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', client.id],
    queryFn: () => clientsApi.getLocations(client.id),
  })

  const { mutate: addLocation, isPending: adding_ } = useMutation({
    mutationFn: () => clientsApi.createLocation(client.id, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations', client.id] })
      setAdding(false)
      setForm({ name: '', city: '', address: '', trackingPhone: '', realPhone: '' })
    },
  })

  const { mutate: removeLocation } = useMutation({
    mutationFn: (locationId: string) => clientsApi.deleteLocation(client.id, locationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['locations', client.id] }),
  })

  if (isLoading) return <div className="p-5"><LoadingRows /></div>

  return (
    <div className="p-5 space-y-3">
      {locations.map((loc: any) => (
        <div key={loc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <MapPin size={14} className="text-brand-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700">{loc.name}</p>
            <p className="text-xs text-slate-400">{loc.city}{loc.address ? ` · ${loc.address}` : ''}</p>
          </div>
          <button onClick={() => removeLocation(loc.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={13} className="text-red-400" />
          </button>
        </div>
      ))}

      {adding && (
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Branch name"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">City *</label>
              <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                placeholder="City"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
              <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                placeholder="Full address"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => addLocation()} disabled={!form.name || !form.city || adding_}
              className="px-4 py-2 bg-brand-600 text-white text-xs font-medium rounded-lg disabled:opacity-50 transition-colors">
              {adding_ ? 'Adding...' : 'Add'}
            </button>
            <button onClick={() => setAdding(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {!adding && (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 hover:border-brand-400 text-slate-500 hover:text-brand-600 text-sm font-medium rounded-xl transition-colors w-full justify-center">
          <Plus size={14} /> Add Location
        </button>
      )}
    </div>
  )
}

// ─── Users Tab ─────────────────────────────────────────────────────────

function EditUsers({ client }: { client: Client }) {
  const qc = useQueryClient()
  const [adding, setAdding] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'CLIENT_ADMIN' })

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', client.id],
    queryFn: () => clientsApi.getUsers(client.id),
  })

  const { mutate: addUser, isPending } = useMutation({
    mutationFn: () => clientsApi.createUser(client.id, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users', client.id] })
      setAdding(false)
      setForm({ firstName: '', lastName: '', email: '', password: '', role: 'CLIENT_ADMIN' })
    },
  })

  const { mutate: removeUser } = useMutation({
    mutationFn: (userId: string) => clientsApi.deleteUser(client.id, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', client.id] }),
  })

  if (isLoading) return <div className="p-5"><LoadingRows /></div>

  return (
    <div className="p-5 space-y-3">
      {users.map((u: any) => (
        <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-brand-600">{u.firstName?.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700">{u.firstName} {u.lastName}</p>
            <p className="text-xs text-slate-400">{u.email} · {u.role?.replace(/_/g, ' ')}</p>
          </div>
          <button onClick={() => removeUser(u.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={13} className="text-red-400" />
          </button>
        </div>
      ))}

      {adding && (
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label>
              <input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                placeholder="John"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
              <input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                placeholder="Doe"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
              <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                type="email" placeholder="admin@clinic.com"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  type={showPw ? 'text' : 'password'} placeholder="Min 6 chars"
                  className="w-full px-3 py-2 pr-8 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                <button onClick={() => setShowPw(p => !p)} className="absolute right-2 top-2 text-slate-400">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                <option value="CLIENT_ADMIN">Client Admin</option>
                <option value="CLIENT_MEMBER">Client Member</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => addUser()} disabled={!form.email || !form.password || !form.firstName || isPending}
              className="px-4 py-2 bg-brand-600 text-white text-xs font-medium rounded-lg disabled:opacity-50">
              {isPending ? 'Adding...' : 'Add User'}
            </button>
            <button onClick={() => setAdding(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-white">
              Cancel
            </button>
          </div>
        </div>
      )}

      {!adding && (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 hover:border-brand-400 text-slate-500 hover:text-brand-600 text-sm font-medium rounded-xl transition-colors w-full justify-center">
          <Plus size={14} /> Add User
        </button>
      )}
    </div>
  )
}

// ─── Integrations Tab ─────────────────────────────────────────────────

function EditIntegrations({ client }: { client: Client }) {
  const qc = useQueryClient()
  const [openProvider, setOpenProvider] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [forms, setForms] = useState<Record<string, any>>({})

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations', client.id],
    queryFn: async () => {
      const c = await clientsApi.getById(client.id)
      return (c as any).integrations || []
    },
  })

  const { mutate: save, isPending } = useMutation({
    mutationFn: (provider: string) => clientsApi.upsertIntegration(client.id, {
      provider,
      ...forms[provider],
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['integrations', client.id] })
      setOpenProvider(null)
    },
  })

  if (isLoading) return <div className="p-5"><LoadingRows /></div>

  return (
    <div className="p-5 space-y-3">
      {INTEGRATIONS_CONFIG.map(config => {
        const existing = integrations.find((i: any) => i.provider === config.provider)
        const isOpen = openProvider === config.provider
        const formData = forms[config.provider] || {}

        return (
          <div key={config.provider} className={`rounded-xl border-2 overflow-hidden transition-all ${isOpen ? 'border-brand-200' : existing ? 'border-emerald-200' : 'border-slate-200'}`}>
            <button
              onClick={() => {
                if (!isOpen) setForms(p => ({ ...p, [config.provider]: { accountId: existing?.accountId || '', accessToken: '', refreshToken: '' } }))
                setOpenProvider(isOpen ? null : config.provider)
              }}
              className={`w-full flex items-center gap-3 p-4 text-left ${isOpen ? 'bg-brand-50' : existing ? 'bg-emerald-50' : 'bg-white hover:bg-slate-50'}`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{config.label}</p>
                <p className="text-xs text-slate-400">
                  {existing ? `Account: ${existing.accountId || 'configured'}` : 'Not configured'}
                </p>
              </div>
              {existing && <CheckCircle2 size={15} className="text-emerald-500" />}
            </button>

            {isOpen && (
              <div className="p-4 bg-white border-t border-slate-100 space-y-3">
                {config.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-700 mb-1">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.secret && !showSecrets[`${config.provider}-${field.key}`] ? 'password' : 'text'}
                        value={formData[field.key] || ''}
                        onChange={e => setForms(p => ({ ...p, [config.provider]: { ...p[config.provider], [field.key]: e.target.value } }))}
                        placeholder={existing && field.secret ? '••••••••' : ''}
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono pr-10"
                      />
                      {field.secret && (
                        <button
                          onClick={() => setShowSecrets(p => ({ ...p, [`${config.provider}-${field.key}`]: !p[`${config.provider}-${field.key}`] }))}
                          className="absolute right-3 top-2.5 text-slate-400">
                          {showSecrets[`${config.provider}-${field.key}`] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                    </div>
                    {existing && field.secret && (
                      <p className="text-xs text-slate-400 mt-1">Leave empty to keep existing token</p>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => save(config.provider)}
                  disabled={isPending}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2">
                  {isPending ? <><Loader2 size={12} className="animate-spin" /> Saving...</> : 'Save Integration'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────

function LoadingRows() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}