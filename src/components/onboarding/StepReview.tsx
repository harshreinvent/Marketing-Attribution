import { useState } from 'react'
import { useMutation , useQueryClient} from '@tanstack/react-query'
import type { OnboardingData } from '@/app/(admin)/admin/clients/new/page'
import { clientsApi } from '@/lib/endpoints'
import { CheckCircle2, Building2, Layers, MapPin, Users, Plug, Loader2 } from 'lucide-react'

type Props = {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  onDone: () => void
}

export function StepReview({ data, onBack, onDone }: Props) {
  const [done, setDone] = useState(false)

const qc = useQueryClient()

const { mutate: create, isPending, error } = useMutation({
  mutationFn: () => clientsApi.create(data),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['clients'] })
    qc.invalidateQueries({ queryKey: ['capabilities'] })
    setDone(true)
  },
})
  if (done) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Client Created!</h2>
        <p className="text-sm text-slate-500 mb-6">{data.name} has been successfully onboarded</p>
        <button onClick={onDone}
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-colors">
          Go to All Clients
        </button>
      </div>
    )
  }

  const sections = [
    {
      icon: <Building2 size={14} />,
      label: 'Basic Info',
      items: [
        { label: 'Name', value: data.name },
        { label: 'Slug', value: data.slug },
        { label: 'Industry', value: data.industry },
        { label: 'Split by location', value: data.websiteSplitByLocation ? 'Yes' : 'No' },
      ],
    },
    {
      icon: <Layers size={14} />,
      label: 'Services',
      items: data.services.map(s => ({ label: s.replace(/_/g, ' '), value: '✓' })),
    },
    {
      icon: <MapPin size={14} />,
      label: 'Locations',
      items: data.locations.map(l => ({ label: l.name, value: l.city })),
    },
    {
      icon: <Users size={14} />,
      label: 'Users',
      items: data.users.map(u => ({ label: `${u.firstName} ${u.lastName}`, value: u.email })),
    },
    {
      icon: <Plug size={14} />,
      label: 'Integrations',
      items: data.integrations.map(i => ({ label: i.provider.replace(/_/g, ' '), value: i.accountId || '—' })),
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Review & Create</h2>
        <p className="text-xs text-slate-400 mt-0.5">Review all details before creating the client</p>
      </div>

      <div className="space-y-3 mb-6">
        {sections.map(section => (
          <div key={section.label} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-slate-100">
              <span className="text-slate-500">{section.icon}</span>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{section.label}</p>
            </div>
            {section.items.length === 0 ? (
              <p className="px-4 py-3 text-xs text-slate-400">None added</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className="text-xs font-medium text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-xs text-red-600">{(error as Error).message}</p>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-slate-100">
        <button onClick={onBack} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
          Back
        </button>
        <button
          onClick={() => create()}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
        >
          {isPending ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create Client'}
        </button>
      </div>
    </div>
  )
}