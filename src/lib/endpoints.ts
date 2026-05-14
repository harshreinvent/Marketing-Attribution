import { api } from './api'
import type {
  AuthTokens, Client, ClientCapabilities, Location,
  ExecutiveSummary, GoogleAdsSummary, MetaAdsSummary,
  WebsiteSummary, FunnelRoiSummary, ApiResponse
} from '@/types'

// ─── Auth ────────────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const { data } = await api.post<ApiResponse<AuthTokens>>('/auth/login', { email, password })
    return data.data
  },

  me: async () => {
    const { data } = await api.get('/auth/me')
    return data.data
  },

  logout: async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken })
  },
}

// ─── Clients ─────────────────────────────────────────────────────────

export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const { data } = await api.get<ApiResponse<Client[]>>('/clients')
    return data.data
  },

  getById: async (clientId: string): Promise<Client> => {
    const { data } = await api.get<ApiResponse<Client>>(`/clients/${clientId}`)
    return data.data
  },

  getCapabilities: async (clientId: string): Promise<ClientCapabilities> => {
    const { data } = await api.get<ApiResponse<ClientCapabilities>>(`/clients/${clientId}/capabilities`)
    return data.data
  },

  getLocations: async (clientId: string): Promise<Location[]> => {
    const { data } = await api.get<ApiResponse<Location[]>>(`/clients/${clientId}/locations`)
    return data.data
  },
}

// ─── Dashboard ───────────────────────────────────────────────────────

const dateParams = (startDate: string, endDate: string) => ({ startDate, endDate })

export const dashboardApi = {
  executive: async (clientId: string, startDate: string, endDate: string): Promise<ExecutiveSummary> => {
    const { data } = await api.get<ApiResponse<ExecutiveSummary>>(
      `/clients/${clientId}/dashboard/executive`,
      { params: dateParams(startDate, endDate) }
    )
    return data.data
  },

  googleAds: async (clientId: string, startDate: string, endDate: string): Promise<GoogleAdsSummary> => {
    const { data } = await api.get<ApiResponse<GoogleAdsSummary>>(
      `/clients/${clientId}/dashboard/google-ads`,
      { params: dateParams(startDate, endDate) }
    )
    return data.data
  },

  metaAds: async (clientId: string, startDate: string, endDate: string): Promise<MetaAdsSummary> => {
    const { data } = await api.get<ApiResponse<MetaAdsSummary>>(
      `/clients/${clientId}/dashboard/meta-ads`,
      { params: dateParams(startDate, endDate) }
    )
    return data.data
  },

  website: async (clientId: string, startDate: string, endDate: string, locationId?: string): Promise<WebsiteSummary> => {
    const { data } = await api.get<ApiResponse<WebsiteSummary>>(
      `/clients/${clientId}/dashboard/website`,
      { params: { ...dateParams(startDate, endDate), ...(locationId ? { locationId } : {}) } }
    )
    return data.data
  },

  funnelRoi: async (clientId: string, startDate: string, endDate: string): Promise<FunnelRoiSummary> => {
    const { data } = await api.get<ApiResponse<FunnelRoiSummary>>(
      `/clients/${clientId}/dashboard/funnel-roi`,
      { params: dateParams(startDate, endDate) }
    )
    return data.data
  },
}

// ─── Sync ────────────────────────────────────────────────────────────

export const syncApi = {
  trigger: async (clientId: string) => {
    const { data } = await api.post(`/clients/${clientId}/sync/trigger`, {
      providers: ['GOOGLE_ADS', 'META_ADS', 'GA4'],
    })
    return data
  },

  getLogs: async (clientId: string) => {
    const { data } = await api.get(`/clients/${clientId}/sync/logs`)
    return data.data
  },
}
