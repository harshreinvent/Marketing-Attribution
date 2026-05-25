'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { StepBasicInfo } from '@/components/onboarding/StepBasicInfo'
import { StepServices } from '@/components/onboarding/StepServices'
import { StepLocations } from '@/components/onboarding/StepLocations'
import { StepUsers } from '@/components/onboarding/StepUsers'
import { StepIntegrations } from '@/components/onboarding/StepIntegrations'
import { StepReview } from '@/components/onboarding/StepReview'
import { CheckCircle2, ChevronRight } from 'lucide-react'

export type OnboardingData = {
  // Step 1
  name: string
  slug: string
  industry: string
  websiteSplitByLocation: boolean
  // Step 2
  services: string[]
  // Step 3
  locations: { name: string; city: string; address: string; trackingPhone: string; realPhone: string }[]
  // Step 4
  users: { firstName: string; lastName: string; email: string; password: string; role: string }[]
  // Step 5
  integrations: {
    provider: string
    accountId: string
    refreshToken: string
    accessToken: string
    extraConfig: Record<string, string>
  }[]
}

const STEPS = [
  { id: 1, label: 'Basic Info',    desc: 'Client details'     },
  { id: 2, label: 'Services',      desc: 'Active channels'    },
  { id: 3, label: 'Locations',     desc: 'Branch setup'       },
  { id: 4, label: 'Users',         desc: 'Login accounts'     },
  { id: 5, label: 'Integrations',  desc: 'API credentials'    },
  { id: 6, label: 'Review',        desc: 'Confirm & create'   },
]

const EMPTY_DATA: OnboardingData = {
  name: '', slug: '', industry: 'healthcare', websiteSplitByLocation: false,
  services: [],
  locations: [],
  users: [],
  integrations: [],
}

export default function NewClientPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(EMPTY_DATA)

  const update = (partial: Partial<OnboardingData>) =>
    setData(prev => ({ ...prev, ...partial }))

  const next = () => setStep(s => Math.min(s + 1, 6))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const stepProps = { data, update, onNext: next, onBack: back }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <main className="flex-1 min-w-0 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <button onClick={() => router.push('/admin')} className="hover:text-brand-600 transition-colors">
              All Clients
            </button>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">New Client</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-1">Onboard New Client</h1>
          <p className="text-xs text-slate-500">Complete all steps to set up a new client</p>
        </div>

        <div className="p-6 max-w-4xl mx-auto">

          {/* Stepper */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className="flex flex-col items-center gap-1 group"
                  disabled={step < s.id}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.id
                      ? 'bg-emerald-500 text-white'
                      : step === s.id
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                        : 'bg-slate-200 text-slate-400'
                  }`}>
                    {step > s.id ? <CheckCircle2 size={14} /> : s.id}
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className={`text-xs font-medium ${step === s.id ? 'text-brand-600' : 'text-slate-400'}`}>
                      {s.label}
                    </p>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.id ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            {step === 1 && <StepBasicInfo    {...stepProps} />}
            {step === 2 && <StepServices     {...stepProps} />}
            {step === 3 && <StepLocations    {...stepProps} />}
            {step === 4 && <StepUsers        {...stepProps} />}
            {step === 5 && <StepIntegrations {...stepProps} />}
            {step === 6 && <StepReview       {...stepProps} onDone={() => router.push('/admin')} />}
          </div>
        </div>
      </main>
    </div>
  )
}