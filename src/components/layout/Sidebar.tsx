'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Users, BarChart3, ChevronRight,
  Building2, RefreshCw, MapPin, LogOut
} from 'lucide-react'

interface SidebarProps {
  clientId?: string
  clientName?: string
  tabs?: { key: string; label: string; href: string; icon: React.ReactNode }[]
  isAdmin?: boolean
}

export const Sidebar = ({ clientId, clientName, tabs, isAdmin }: SidebarProps) => {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const adminLinks = [
    { href: '/admin',              label: 'All Clients',  icon: <Users size={15} /> },
    { href: '/admin/locations',    label: 'Locations',    icon: <MapPin size={15} /> },
    { href: '/admin/sync-status',  label: 'Sync Status',  icon: <RefreshCw size={15} /> },
    { href: '/admin/users',        label: 'Users',        icon: <Building2 size={15} /> },
  ]

  return (
    <aside className="w-56 flex-shrink-0 h-screen sticky top-0 bg-slate-950 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <BarChart3 size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Eledent</p>
            <p className="text-xs text-slate-500 leading-tight">Attribution</p>
          </div>
        </div>
      </div>

      {/* Client context */}
      {clientName && (
        <div className="px-3 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2 px-2.5 py-2 bg-slate-900 rounded-lg">
            <Building2 size={12} className="text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-300 font-medium truncate">{clientName}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {/* Admin links */}
        {isAdmin && (
          <>
            <p className="px-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 mt-1">Admin</p>
            {adminLinks.map(link => (
              <SidebarLink key={link.href} href={link.href} active={pathname === link.href} icon={link.icon} label={link.label} />
            ))}
          </>
        )}

        {/* Dashboard tabs */}
        {tabs && tabs.length > 0 && (
          <>
            <p className="px-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 mt-3">Dashboard</p>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => (tab as any).onClick?.()}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left',
                  pathname.includes(tab.key)
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                )}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-slate-800">
        <div className="px-2.5 py-2 mb-1">
          <p className="text-xs font-medium text-slate-300 truncate">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors text-xs"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

const SidebarLink = ({ href, active, icon, label }: { href: string; active: boolean; icon: React.ReactNode; label: string }) => (
  <Link
    href={href}
    className={cn(
      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors',
      active ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
    )}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="truncate">{label}</span>
    {active && <ChevronRight size={12} className="ml-auto opacity-60" />}
  </Link>
)
