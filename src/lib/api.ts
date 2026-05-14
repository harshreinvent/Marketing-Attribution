import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// Main axios instance — used for all API calls
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach access token to every request automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — try refresh token, then logout if that fails
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
        const { accessToken, refreshToken: newRefresh } = data.data

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefresh)

        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      } catch {
        // Refresh failed — clear everything and go to login
        localStorage.clear()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)
