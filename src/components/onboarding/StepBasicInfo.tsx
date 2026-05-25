import { useEffect } from 'react'
import type { OnboardingData } from '@/app/(admin)/admin/clients/new/page'
import { Building2, Link2, Briefcase, LayoutDashboard } from 'lucide-react'

type Props = {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function StepBasicInfo({ data, update, onNext }: Props) {
  useEffect(() => {
    if (data.name) update({ slug: toSlug(data.name) })
  }, [data.name])

  const valid = data.name.trim().length > 0 && data.slug.trim().length > 0

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Basic Information</h2>
        <p className="text-xs text-slate-400 mt-0.5">Enter the client's basic details</p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Client Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Building2 size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={data.name}
              onChange={e => update({ name: e.target.value })}
              placeholder="e.g. Asian Clinic"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors"
            />
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Slug <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Link2 size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={data.slug}
              onChange={e => update({ slug: e.target.value })}
              placeholder="asian-clinic"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors font-mono"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Used in URLs — auto-generated from name</p>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Industry</label>
          <div className="relative">
            <Briefcase size={14} className="absolute left-3 top-3 text-slate-400" />
            <select
              value={data.industry}
              onChange={e => update({ industry: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors appearance-none"
            >
              <option value="healthcare">Healthcare</option>
              <option value="dental">Dental</option>
              <option value="education">Education</option>
              <option value="real-estate">Real Estate</option>
              <option value="retail">Retail</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Website split by location */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
              <LayoutDashboard size={14} className="text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Split Website by Location</p>
              <p className="text-xs text-slate-400">Show separate website tab per branch</p>
            </div>
          </div>
          <button
            onClick={() => update({ websiteSplitByLocation: !data.websiteSplitByLocation })}
            className={`w-11 h-6 rounded-full transition-colors relative ${data.websiteSplitByLocation ? 'bg-brand-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data.websiteSplitByLocation ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={onNext}
          disabled={!valid}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}