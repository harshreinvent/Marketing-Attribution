import { useState } from 'react'
import type { OnboardingData } from '@/app/(admin)/admin/clients/new/page'
import { MapPin, Plus, Trash2 } from 'lucide-react'

type Props = {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

type Location = OnboardingData['locations'][0]

const EMPTY_LOC: Location = { name: '', city: '', address: '', trackingPhone: '', realPhone: '' }

export function StepLocations({ data, update, onNext, onBack }: Props) {
  const [editing, setEditing] = useState<Location | null>(null)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<Location>(EMPTY_LOC)

  const openAdd = () => { setForm(EMPTY_LOC); setEditing(null); setEditIdx(null); setAdding(true) }
  const openEdit = (loc: Location, i: number) => { setForm(loc); setEditing(loc); setEditIdx(i); setAdding(true) }

  const save = () => {
    if (!form.name || !form.city) return
    const updated = [...data.locations]
    if (editIdx !== null) updated[editIdx] = form
    else updated.push(form)
    update({ locations: updated })
    setAdding(false)
    setForm(EMPTY_LOC)
  }

  const remove = (i: number) => {
    update({ locations: data.locations.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Locations / Branches</h2>
        <p className="text-xs text-slate-400 mt-0.5">Add physical clinic branches for this client</p>
      </div>

      {/* Location list */}
      <div className="space-y-2 mb-4">
        {data.locations.map((loc, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-brand-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700">{loc.name}</p>
              <p className="text-xs text-slate-400">{loc.city}{loc.address ? ` · ${loc.address}` : ''}</p>
            </div>
            <button onClick={() => openEdit(loc, i)} className="text-xs text-brand-600 hover:underline">Edit</button>
            <button onClick={() => remove(i)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={13} className="text-red-400" />
            </button>
          </div>
        ))}

        {data.locations.length === 0 && !adding && (
          <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
            <MapPin size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No locations added yet</p>
          </div>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl mb-4 space-y-3">
          <p className="text-xs font-semibold text-brand-700">{editIdx !== null ? 'Edit Location' : 'Add Location'}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Kondapur Branch"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">City *</label>
              <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                placeholder="Hyderabad"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
              <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                placeholder="Full address"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tracking Phone</label>
              <input value={form.trackingPhone} onChange={e => setForm(p => ({ ...p, trackingPhone: e.target.value }))}
                placeholder="Exotel virtual number"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Real Phone</label>
              <input value={form.realPhone} onChange={e => setForm(p => ({ ...p, realPhone: e.target.value }))}
                placeholder="Actual clinic number"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={!form.name || !form.city}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors">
              {editIdx !== null ? 'Update' : 'Add Location'}
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
          <Plus size={14} /> Add Location
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