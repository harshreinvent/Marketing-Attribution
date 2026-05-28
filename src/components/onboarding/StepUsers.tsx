import { useState } from 'react'
import type { OnboardingData } from '@/app/(admin)/admin/clients/new/page'
import { User, Mail, Lock, Plus, Trash2, Eye, EyeOff } from 'lucide-react'

type Props = {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

type UserForm = OnboardingData['users'][0]
const EMPTY: UserForm = { firstName: '', lastName: '', email: '', password: '', role: 'CLIENT_ADMIN' }

export function StepUsers({ data, update, onNext, onBack }: Props) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<UserForm>(EMPTY)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [showPw, setShowPw] = useState(false)

  const openAdd = () => { setForm(EMPTY); setEditIdx(null); setAdding(true) }
  const openEdit = (u: UserForm, i: number) => { setForm(u); setEditIdx(i); setAdding(true) }

  const save = () => {
    if (!form.email || !form.password || !form.firstName) return
    const updated = [...data.users]
    if (editIdx !== null) updated[editIdx] = form
    else updated.push(form)
    update({ users: updated })
    setAdding(false)
    setForm(EMPTY)
  }

  const remove = (i: number) => update({ users: data.users.filter((_, idx) => idx !== i) })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">User Accounts</h2>
        <p className="text-xs text-slate-400 mt-0.5">Create login accounts for this client</p>
      </div>

      <div className="space-y-2 mb-4">
        {data.users.map((u, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-brand-600">{u.firstName.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700">{u.firstName} {u.lastName}</p>
              <p className="text-xs text-slate-400">{u.email} · {u.role.replace(/_/g, ' ')}</p>
            </div>
            <button onClick={() => openEdit(u, i)} className="text-xs text-brand-600 hover:underline">Edit</button>
            <button onClick={() => remove(i)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={13} className="text-red-400" />
            </button>
          </div>
        ))}

        {data.users.length === 0 && !adding && (
          <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
            <User size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No users added yet</p>
          </div>
        )}
      </div>

      {adding && (
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl mb-4 space-y-3">
          <p className="text-xs font-semibold text-brand-700">{editIdx !== null ? 'Edit User' : 'Add User'}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label>
              <input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                placeholder="John"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
              <input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                placeholder="Doe"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-2.5 text-slate-400" />
                <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@asianclinic.com" type="email"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-2.5 text-slate-400" />
                <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min 8 characters" type={showPw ? 'text' : 'password'}
                  className="w-full pl-8 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
                <button onClick={() => setShowPw(p => !p)} className="absolute right-3 top-2.5 text-slate-400">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="CLIENT_ADMIN">Client Admin</option>
                <option value="CLIENT_MEMBER">Client Member</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={!form.email || !form.password || !form.firstName}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors">
              {editIdx !== null ? 'Update' : 'Add User'}
            </button>
            <button onClick={() => setAdding(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {!adding && (
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 hover:border-brand-400 text-slate-500 hover:text-brand-600 text-sm font-medium rounded-xl transition-colors w-full justify-center">
          <Plus size={14} /> Add User
        </button>
      )}

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