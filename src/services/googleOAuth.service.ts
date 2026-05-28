import db from '../config/db'
import { createOAuth2Client, GOOGLE_SCOPES } from '../config/google'
import { encrypt, decrypt } from '../utils/encryption'
import logger from '../config/logger'

export const googleOAuthService = {
  // Build the consent URL the agency admin visits to authorise
  getAuthUrl(): string {
    const client = createOAuth2Client()
    return client.generateAuthUrl({
      access_type: 'offline',
      prompt:      'consent select_account',
      scope:       GOOGLE_SCOPES,
    })
  },

  // Called by the OAuth callback — exchanges code for tokens, saves encrypted
  async handleCallback(code: string): Promise<string> {
    const client = createOAuth2Client()
    const { tokens } = await client.getToken(code)

    if (!tokens.refresh_token) {
      throw new Error(
        'No refresh_token returned. Make sure prompt=consent was used so Google always returns a fresh token.'
      )
    }

    const encrypted = encrypt(tokens.refresh_token)

    // Only one agency auth row should ever exist — upsert
    const existing = await db.googleAgencyAuth.findFirst()
    if (existing) {
      await db.googleAgencyAuth.update({
        where: { id: existing.id },
        data: {
          refreshTokenEncrypted: encrypted,
          scopes:    tokens.scope ?? '',
          status:    'active',
          lastError: null,
        },
      })
    } else {
      await db.googleAgencyAuth.create({
        data: {
          accountEmail:          '',
          refreshTokenEncrypted: encrypted,
          scopes:                tokens.scope ?? '',
        },
      })
    }

    logger.info('[GoogleOAuth] Agency refresh token saved')
    return tokens.access_token ?? ''
  },

  // Manually save a refresh token (e.g. obtained from OAuth Playground)
  async saveRefreshToken(refreshToken: string, accountEmail = ''): Promise<void> {
    const encrypted = encrypt(refreshToken)
    const existing  = await db.googleAgencyAuth.findFirst()

    if (existing) {
      await db.googleAgencyAuth.update({
        where: { id: existing.id },
        data:  { refreshTokenEncrypted: encrypted, accountEmail, status: 'active', lastError: null },
      })
    } else {
      await db.googleAgencyAuth.create({
        data: { refreshTokenEncrypted: encrypted, accountEmail, scopes: 'https://www.googleapis.com/auth/analytics.readonly', status: 'active' },
      })
    }
    logger.info('[GoogleOAuth] Refresh token saved manually')
  },

  // Returns an OAuth2 client with a fresh access token for GA4 API calls
  async getAuthenticatedClient() {
    const record = await db.googleAgencyAuth.findFirst({ where: { status: 'active' } })
    if (!record) {
      throw new Error(
        'No active Google agency auth found. Visit GET /api/v1/google/connect to authorise.'
      )
    }

    const refreshToken = decrypt(record.refreshTokenEncrypted)
    const client       = createOAuth2Client()
    client.setCredentials({ refresh_token: refreshToken })
    return client
  },
}
