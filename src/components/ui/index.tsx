'use client'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'

// ─── Card ─────────────────────────────────────────────────────────────

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('bg-white rounded-xl border border-slate-100 shadow-card', className)} {...props}>
    {children}
  </div>
)

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-5 py-4 border-b border-slate-100', className)} {...props}>{children}</div>
)

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-sm font-semibold text-slate-800', className)} {...props}>{children}</h3>
)

export const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5', className)} {...props}>{children}</div>
)

// ─── Stat Card ────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: string
  icon?: React.ReactNode
}

export const StatCard = ({ label, value, sub, color = 'text-brand-600', icon }: StatCardProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">{label}</p>
          <p className={cn('text-2xl font-bold mt-1 leading-tight', color)}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 text-brand-500">
            {icon}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)

// ─── Table ────────────────────────────────────────────────────────────

export const Table = ({ className, children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full text-sm', className)} {...props}>{children}</table>
  </div>
)

export const Th = ({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap', className)} {...props}>
    {children}
  </th>
)

export const Td = ({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-4 py-3 text-slate-700 border-b border-slate-50 whitespace-nowrap', className)} {...props}>
    {children}
  </td>
)

// ─── Badge ────────────────────────────────────────────────────────────

type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'gray'

const badgeStyles: Record<BadgeVariant, string> = {
  green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  red:    'bg-red-50 text-red-700 border-red-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  blue:   'bg-brand-50 text-brand-700 border-brand-200',
  gray:   'bg-slate-100 text-slate-600 border-slate-200',
}

export const Badge = ({ variant = 'gray', children }: { variant?: BadgeVariant; children: React.ReactNode }) => (
  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', badgeStyles[variant])}>
    {children}
  </span>
)

// ─── Loading ──────────────────────────────────────────────────────────

// ─── Loading ──────────────────────────────────────────────────────────

export const Spinner = ({ className }: { className?: string }) => (
  <Loader2 className={cn('animate-spin text-brand-500', className)} size={20} />
)

export const LoadingState = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <Spinner className="w-8 h-8" />
    <p className="text-sm text-slate-500">{message}</p>
  </div>
)

type LoaderType = 'ring' | 'custom'

export const Loader = ({ type = 'ring' }: { type?: LoaderType }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {type === 'ring' ? (
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.2)',
        borderTopColor: '#ffffff',
        animation: 'loaderSpin 0.7s linear infinite',
      }} />
    ) : (
      <div className="custom-loader" style={{
        position: 'relative',
        width: '2.5em',
        height: '2.5em',
        transform: 'rotate(165deg)',
      }} />
    )}

    <style>{`
      @keyframes loaderSpin {
        to { transform: rotate(360deg); }
      }
      .custom-loader::before,
      .custom-loader::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        width: 0.5em;
        height: 0.5em;
        border-radius: 0.25em;
        transform: translate(-50%, -50%);
      }
      .custom-loader::before { animation: before8 2s infinite; }
      .custom-loader::after  { animation: after6 2s infinite; }
      @keyframes before8 {
        0%   { width: 0.5em; box-shadow: 1em -0.5em rgba(225,20,98,0.75), -1em 0.5em rgba(111,202,220,0.75); }
        35%  { width: 2.5em; box-shadow: 0 -0.5em rgba(225,20,98,0.75), 0 0.5em rgba(111,202,220,0.75); }
        70%  { width: 0.5em; box-shadow: -1em -0.5em rgba(225,20,98,0.75), 1em 0.5em rgba(111,202,220,0.75); }
        100% { box-shadow: 1em -0.5em rgba(225,20,98,0.75), -1em 0.5em rgba(111,202,220,0.75); }
      }
      @keyframes after6 {
        0%   { height: 0.5em; box-shadow: 0.5em 1em rgba(61,184,143,0.75), -0.5em -1em rgba(233,169,32,0.75); }
        35%  { height: 2.5em; box-shadow: 0.5em 0 rgba(61,184,143,0.75), -0.5em 0 rgba(233,169,32,0.75); }
        70%  { height: 0.5em; box-shadow: 0.5em -1em rgba(61,184,143,0.75), -0.5em 1em rgba(233,169,32,0.75); }
        100% { box-shadow: 0.5em 1em rgba(61,184,143,0.75), -0.5em -1em rgba(233,169,32,0.75); }
      }
    `}</style>
  </div>
)

export const EmptyState = ({ title, description }: { title: string; description?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
      <span className="text-2xl">📭</span>
    </div>
    <p className="text-sm font-medium text-slate-700">{title}</p>
    {description && <p className="text-xs text-slate-400 max-w-xs">{description}</p>}
  </div>
)

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
      <span className="text-2xl">⚠️</span>
    </div>
    <p className="text-sm text-slate-600">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="text-xs text-brand-600 hover:underline">
        Try again
      </button>
    )}
  </div>
)

// ─── Button ───────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
}

const buttonStyles = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
  ghost: 'text-slate-600 hover:bg-slate-100',
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export const Button = ({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }: ButtonProps) => (
  <button
    className={cn(
      'inline-flex items-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      buttonStyles[variant],
      buttonSizes[size],
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Spinner className="w-3.5 h-3.5" />}
    {children}
  </button>
)

// ─── No Integration ───────────────────────────────────────────────────

export const NoIntegration = ({ service }: { service: string }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
      <span className="text-3xl">🔌</span>
    </div>
    <div className="text-center">
      <p className="text-sm font-semibold text-slate-700">{service} not configured</p>
      <p className="text-xs text-slate-400 mt-1">Contact your agency admin to set up this integration</p>
    </div>
  </div>
)
