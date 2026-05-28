'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthInit } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card, CardContent } from '@/components/ui'
import { Users, Shield, Mail } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  AGENCY_ADMIN: 'Agency Admin',
  AGENCY_MEMBER: 'Agency Member',
  CLIENT_ADMIN: 'Client Admin',
  CLIENT_MEMBER: 'Client Member',
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  AGENCY_ADMIN: 'bg-brand-100 text-brand-700',
  AGENCY_MEMBER: 'bg-blue-100 text-blue-700',
  CLIENT_ADMIN: 'bg-emerald-100 text-emerald-700',
  CLIENT_MEMBER: 'bg-slate-100 text-slate-600',
}

export default function UsersPage() {
  useAuthInit()
  const router = useRouter()
  const { user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading])

  // Role hierarchy explanation
  const roles = [
    { role: 'SUPER_ADMIN', desc: 'You — full access to everything', count: 1 },
    { role: 'AGENCY_ADMIN', desc: 'Your team — manages all clients', count: null },
    { role: 'AGENCY_MEMBER', desc: 'Your team — read access across clients', count: null },
    { role: 'CLIENT_ADMIN', desc: 'Clinic owner — sees only their data', count: null },
    { role: 'CLIENT_MEMBER', desc: 'Clinic staff — read only', count: null },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <main className="flex-1 min-w-0">
        <div className="bg-white border-b border-slate-100 px-6 py-4">
          <h1 className="text-lg font-bold text-slate-900">Users</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage user accounts and roles</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Current user */}
          {user && (
            <Card>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-brand-600">{user.firstName?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                    <span className={`inline-flex mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Role hierarchy */}
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-800">Role Hierarchy</h3>
              </div>
            </div>
            <CardContent>
              <div className="space-y-3">
                {roles.map((r, i) => (
                  <div key={r.role} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-slate-500">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[r.role]}`}>
                          {ROLE_LABELS[r.role]}
                        </span>
                        {r.role === user?.role && (
                          <span className="text-xs text-brand-500 font-medium">← you</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} className="text-brand-500" />
              <p className="text-xs font-medium text-brand-700">Create users via API</p>
            </div>
            <p className="text-xs text-brand-600">
              Use <code className="bg-brand-100 px-1 rounded font-mono">POST /api/v1/auth/register</code> to create new users.
              Use the Postman collection included in the backend setup.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
