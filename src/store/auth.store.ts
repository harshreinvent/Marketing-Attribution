'use client'
import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean

  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  isAgency: () => boolean
  isClient: () => boolean
  isSuperAdmin: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, accessToken, isLoading: false })
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    set({ user: null, accessToken: null, isLoading: false })
  },

  setLoading: (isLoading) => set({ isLoading }),

  isAgency: () => {
    const role = get().user?.role
    return role === 'SUPER_ADMIN' || role === 'AGENCY_ADMIN' || role === 'AGENCY_MEMBER'
  },

  isClient: () => {
    const role = get().user?.role
    return role === 'CLIENT_ADMIN' || role === 'CLIENT_MEMBER'
  },

  isSuperAdmin: () => get().user?.role === 'SUPER_ADMIN',
}))
