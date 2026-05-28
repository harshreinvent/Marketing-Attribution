'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Users, BarChart3, ChevronRight,
  Building2, RefreshCw, MapPin, LogOut, Menu, X
} from 'lucide-react'

interface SidebarProps {
  clientId?: string
  clientName?: string
  tabs?: { key: string; label: string; href: string; icon: React.ReactNode; onClick?: () => void }[]
  isAdmin?: boolean
  activeTab?: string
  onTabClick?: (key: string) => void
}

export const Sidebar = ({ clientId, clientName, tabs, isAdmin, activeTab, onTabClick }: SidebarProps) => {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const adminLinks = [
    { href: '/admin',             label: 'All Clients', icon: <Users size={15} /> },
    { href: '/admin/locations',   label: 'Locations',   icon: <MapPin size={15} /> },
    { href: '/admin/sync-status', label: 'Sync Status', icon: <RefreshCw size={15} /> },
    { href: '/admin/users',       label: 'Users',       icon: <Building2 size={15} /> },
  ]

  const close = () => setOpen(false)

  const sidebarContent = (
    <aside className="w-56 h-full bg-slate-950 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <BarChart3 size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Eledent</p>
            <p className="text-xs text-slate-500 leading-tight">Attribution</p>
          </div>
        </div>
        <button onClick={close} className="md:hidden text-slate-500 hover:text-slate-300 p-1">
          <X size={16} />
        </button>
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
        {isAdmin && (
          <>
            <p className="px-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 mt-1">
              Admin
            </p>
            {adminLinks.map(link => (
              <SidebarLink
                key={link.href}
                href={link.href}
                active={pathname === link.href}
                icon={link.icon}
                label={link.label}
                onClick={close}
              />
            ))}
          </>
        )}

        {tabs && tabs.length > 0 && (
          <>
            <p className="px-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 mt-3">
              Dashboard
            </p>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  onTabClick?.(tab.key)
                  tab.onClick?.()
                  close()
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left',
                  activeTab === tab.key
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                )}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
                {activeTab === tab.key && <ChevronRight size={12} className="ml-auto opacity-60" />}
              </button>
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-slate-800">
        <div className="px-2.5 py-2 mb-1">
          <p className="text-xs font-medium text-slate-300 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={() => { logout(); close() }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors text-xs"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-slate-950 text-white shadow-lg',
          open && 'hidden'
        )}
      >
        <Menu size={18} />
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={close} />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          'md:hidden fixed top-0 left-0 z-50 h-full w-56 transform transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  )
}

const SidebarLink = ({
  href, active, icon, label, onClick
}: {
  href: string
  active: boolean
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) => (
  <Link
    href={href}
    onClick={onClick}
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