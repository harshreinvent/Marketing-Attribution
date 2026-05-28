'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '@/lib/endpoints'

export const useAuth = () => {
  const store = useAuthStore()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    const tokens = await authApi.login(email, password)
    store.setAuth(tokens.user, tokens.accessToken, tokens.refreshToken)
    return tokens.user
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      try { await authApi.logout(refreshToken) } catch {}
    }
    store.clearAuth()
    router.push('/login')
  }

  return { ...store, login, logout }
}

// Restores auth state from localStorage on app load
export const useAuthInit = () => {
  const store = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        store.setAuth(user, token, localStorage.getItem('refreshToken') || '')
      } catch {
        store.clearAuth()
      }
    } else {
      store.setLoading(false)
    }
  }, [])
}
