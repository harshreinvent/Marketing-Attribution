'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAuthInit } from '@/hooks/useAuth'
import { BarChart3, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  useAuthInit()
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      // Agency/admin roles go to admin dashboard
      // Client roles go to their client dashboard
      if (user.role === 'CLIENT_ADMIN' || user.role === 'CLIENT_MEMBER') {
        if (user.clientId) {
          router.push(`/admin/clients/${user.clientId}`)
        } else {
          setError('No client assigned to your account.')
        }
      } else {
        router.push('/admin')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-white leading-tight">Eledent</p>
            <p className="text-xs text-slate-400">Attribution Dashboard</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-lg font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-slate-400 mb-6">Enter your credentials to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@agency.com"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Quick fill hints */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
            <p className="text-xs text-slate-500 font-medium">Quick fill (dev only):</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Agency Admin', email: 'admin@agency.com' },
                { label: 'Eledent Client', email: 'admin@eledent.com' },
                { label: 'Asian Client', email: 'admin@asianclinic.com' },
                { label: 'Member', email: 'member@agency.com' },
              ].map(u => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => { setEmail(u.email); setPassword('Admin@1234') }}
                  className="text-left px-2.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <p className="text-xs font-medium text-slate-300">{u.label}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
