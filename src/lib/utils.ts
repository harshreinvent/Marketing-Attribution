import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatCurrency = (value: number, currency = '₹') => {
  if (value >= 10000000) return `${currency}${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `${currency}${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `${currency}${(value / 1000).toFixed(1)}K`
  return `${currency}${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export const formatNumber = (value: number) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toLocaleString('en-IN')
}

// Always show exact number with commas — no K/L/Cr abbreviation
export const formatExact = (value: number) =>
  value.toLocaleString('en-IN')

export const formatPercent = (value: number, decimals = 1) =>
  `${Number(value).toFixed(decimals)}%`

export const getDefaultDateRange = () => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 90)
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  }
}

export const CHANNEL_COLORS: Record<string, string> = {
  GOOGLE_ADS: '#4285F4',
  META_ADS: '#1877F2',
  SEO_ORGANIC: '#34A853',
  GBP: '#FBBC04',
  ORGANIC_SOCIAL: '#EA4335',
  WHATSAPP: '#25D366',
  DIRECT: '#9E9E9E',
  UNKNOWN: '#BDBDBD',
  facebook: '#1877F2',
  google: '#4285F4',
  instagram: '#E1306C',
  whatsapp: '#25D366',
}

export const PIE_COLORS = ['#5563f8', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export const CHANNEL_LABELS: Record<string, string> = {
  GOOGLE_ADS: 'Google Ads',
  META_ADS: 'Meta Ads',
  SEO_ORGANIC: 'Organic Search',
  GBP: 'Google Business',
  ORGANIC_SOCIAL: 'Organic Social',
  WHATSAPP: 'WhatsApp',
  DIRECT: 'Direct',
  UNKNOWN: 'Unknown',
}