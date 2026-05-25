export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title:       'Attribution Dashboard API',
    version:     '2.0.0',
    description: [
      'Marketing Attribution Dashboard — Merged Backend API (v2)',
      '',
      '**How to authenticate:**',
      '1. `POST /api/v1/auth/login` — sign in with email + password',
      '2. Copy the `accessToken` from the response',
      '3. Click **Authorize** (lock icon) and enter `Bearer <accessToken>`',
      '4. All protected routes will now work',
      '',
      'Users are created by agency admins via `POST /api/v1/auth/register`.',
    ].join('\n'),
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Local development' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type:         'http',
        scheme:       'bearer',
        bearerFormat: 'JWT',
        description:  'Paste the accessToken returned by POST /api/v1/auth/login',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string',  example: 'Unauthorized' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // ── Health ────────────────────────────────────────────────────────────────
    '/api/v1/health': {
      get: {
        tags:     ['System'],
        summary:  'Health check',
        security: [],
        responses: {
          '200': {
            description: 'DB and cache connectivity',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    db:     { type: 'string', example: 'connected' },
                    cache:  { type: 'string', example: 'ok' },
                    ts:     { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ── Auth ──────────────────────────────────────────────────────────────────
    '/api/v1/auth/login': {
      post: {
        tags:     ['Auth'],
        summary:  'Login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type:       'object',
                required:   ['email', 'password'],
                properties: {
                  email:    { type: 'string', format: 'email', example: 'admin@agency.com' },
                  password: { type: 'string', example: 'Password123!' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken:  { type: 'string' },
                    refreshToken: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        id:        { type: 'string' },
                        email:     { type: 'string' },
                        firstName: { type: 'string' },
                        lastName:  { type: 'string' },
                        role:      { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    '/api/v1/auth/register': {
      post: {
        tags:    ['Auth'],
        summary: 'Register user (agency admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type:       'object',
                required:   ['email', 'password', 'firstName', 'lastName'],
                properties: {
                  email:     { type: 'string', format: 'email' },
                  password:  { type: 'string', minLength: 8 },
                  firstName: { type: 'string' },
                  lastName:  { type: 'string' },
                  role:      { type: 'string', enum: ['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENCY_MEMBER', 'CLIENT_ADMIN', 'CLIENT_MEMBER'] },
                  agencyId:  { type: 'string' },
                  clientId:  { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User created' },
          '409': { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    '/api/v1/auth/refresh': {
      post: {
        tags:     ['Auth'],
        summary:  'Refresh tokens',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type:       'object',
                required:   ['refreshToken'],
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          '200': { description: 'New token pair' },
          '401': { description: 'Invalid or expired refresh token', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    '/api/v1/auth/me': {
      get: {
        tags:    ['Auth'],
        summary: 'Current user',
        responses: {
          '200': { description: 'Authenticated user info' },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // ── Clients ───────────────────────────────────────────────────────────────
    '/api/v1/clients': {
      get: {
        tags:    ['Clients'],
        summary: 'List clients',
        responses: {
          '200': { description: 'Array of clients' },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        tags:    ['Clients'],
        summary: 'Create client (agency admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type:       'object',
                required:   ['name', 'slug'],
                properties: {
                  name:     { type: 'string', example: 'Acme Dental' },
                  slug:     { type: 'string', example: 'acme-dental' },
                  agencyId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Client created' },
          '409': { description: 'Slug already taken', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    '/api/v1/clients/{clientId}': {
      get: {
        tags:       ['Clients'],
        summary:    'Get client',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        responses:  { '200': { description: 'Client detail' } },
      },
      patch: {
        tags:       ['Clients'],
        summary:    'Update client',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: false,
          content:  { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { '200': { description: 'Client updated' } },
      },
    },

    '/api/v1/clients/{clientId}/capabilities': {
      get: {
        tags:       ['Clients'],
        summary:    'Client capabilities — which dashboard tabs to show',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        responses:  { '200': { description: 'ClientCapabilities object' } },
      },
    },

    '/api/v1/clients/{clientId}/services': {
      get: {
        tags:       ['Clients'],
        summary:    'List services configured for client',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        responses:  { '200': { description: 'Array of ClientService records' } },
      },
      post: {
        tags:       ['Clients'],
        summary:    'Configure services for client',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type:       'object',
                required:   ['services'],
                properties: {
                  services: {
                    type:  'array',
                    items: { type: 'string', enum: ['GOOGLE_ADS', 'META_ADS', 'SEO', 'GMB', 'WEBSITE', 'WHATSAPP', 'CALL_TRACKING', 'CRM'] },
                  },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Services configured' } },
      },
    },

    '/api/v1/clients/{clientId}/locations': {
      get: {
        tags:       ['Locations'],
        summary:    'List locations for client',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        responses:  { '200': { description: 'Array of locations' } },
      },
      post: {
        tags:       ['Locations'],
        summary:    'Add location to client',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type:       'object',
                required:   ['name'],
                properties: {
                  name:          { type: 'string', example: 'Kondapur Branch' },
                  city:          { type: 'string', example: 'Hyderabad' },
                  address:       { type: 'string' },
                  trackingPhone: { type: 'string', description: 'Exotel virtual number for call tracking' },
                  realPhone:     { type: 'string' },
                  crmLocationId: { type: 'string', description: 'GoHighLevel sub-account ID' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Location created' } },
      },
    },

    '/api/v1/clients/{clientId}/locations/{locationId}/gmb': {
      get: {
        tags:       ['Locations'],
        summary:    'List GMB listings for a location',
        parameters: [
          { name: 'clientId',   in: 'path', required: true, schema: { type: 'string' } },
          { name: 'locationId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Array of GmbListing records' } },
      },
      post: {
        tags:       ['Locations'],
        summary:    'Add a Google Business Profile listing to a location',
        parameters: [
          { name: 'clientId',   in: 'path', required: true, schema: { type: 'string' } },
          { name: 'locationId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type:       'object',
                required:   ['listingId', 'name'],
                properties: {
                  listingId:     { type: 'string', example: '1234567890123456789', description: 'Numeric Google Business Profile location ID' },
                  name:          { type: 'string', example: 'Kondapur Branch' },
                  address:       { type: 'string', example: 'Plot 42, Kondapur, Hyderabad' },
                  trackingPhone: { type: 'string', example: '+914041234567' },
                  realPhone:     { type: 'string', example: '+919876543210' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'GMB listing added' },
          '400': { description: 'Validation error' },
        },
      },
    },

    '/api/v1/clients/{clientId}/locations/{locationId}/gmb/{listingId}': {
      delete: {
        tags:       ['Locations'],
        summary:    'Remove (soft-delete) a GMB listing',
        parameters: [
          { name: 'clientId',   in: 'path', required: true, schema: { type: 'string' } },
          { name: 'locationId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'listingId',  in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { '204': { description: 'Listing removed' } },
      },
    },

    '/api/v1/clients/{clientId}/integrations': {
      get: {
        tags:       ['Integrations'],
        summary:    'List integrations for client',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        responses:  { '200': { description: 'Array of integrations' } },
      },
      post: {
        tags:       ['Integrations'],
        summary:    'Upsert integration for client',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type:       'object',
                required:   ['provider'],
                properties: {
                  provider:     { type: 'string', enum: ['GOOGLE_ADS', 'GOOGLE_ANALYTICS', 'META_ADS', 'GMB', 'GOHIGHLEVEL', 'EXOTEL'] },
                  accessToken:  { type: 'string' },
                  refreshToken: { type: 'string', description: 'For GMB: refresh token from the client\'s GBP Google Cloud project' },
                  accountId:    { type: 'string' },
                  extraConfig:  { type: 'object', description: 'For GMB: { "clientId": "...", "clientSecret": "..." } of the client\'s GBP GCP project. Omit to use env GMB_CLIENT_ID/GMB_CLIENT_SECRET.' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Integration saved' } },
      },
    },

    // ── Dashboard ─────────────────────────────────────────────────────────────
    '/api/v1/clients/{clientId}/dashboard/executive': {
      get: {
        tags:    ['Dashboard'],
        summary: 'Executive summary — blended KPIs across all channels',
        parameters: [
          { name: 'clientId',  in: 'path',  required: true,  schema: { type: 'string' } },
          { name: 'startDate', in: 'query', required: false, schema: { type: 'string', format: 'date' }, example: '2026-05-01' },
          { name: 'endDate',   in: 'query', required: false, schema: { type: 'string', format: 'date' }, example: '2026-05-21' },
        ],
        responses: { '200': { description: 'ExecutiveSummary object' } },
      },
    },

    '/api/v1/clients/{clientId}/dashboard/google-ads': {
      get: {
        tags:    ['Dashboard'],
        summary: 'Google Ads KPIs + campaign breakdown',
        parameters: [
          { name: 'clientId',  in: 'path',  required: true,  schema: { type: 'string' } },
          { name: 'startDate', in: 'query', required: false, schema: { type: 'string', format: 'date' } },
          { name: 'endDate',   in: 'query', required: false, schema: { type: 'string', format: 'date' } },
        ],
        responses: { '200': { description: 'GoogleAdsSummary — hasIntegration: false if not configured' } },
      },
    },

    '/api/v1/clients/{clientId}/dashboard/meta-ads': {
      get: {
        tags:    ['Dashboard'],
        summary: 'Meta Ads KPIs + campaign breakdown',
        parameters: [
          { name: 'clientId',  in: 'path',  required: true,  schema: { type: 'string' } },
          { name: 'startDate', in: 'query', required: false, schema: { type: 'string', format: 'date' } },
          { name: 'endDate',   in: 'query', required: false, schema: { type: 'string', format: 'date' } },
        ],
        responses: { '200': { description: 'MetaAdsSummary — hasIntegration: false if not configured' } },
      },
    },

    '/api/v1/clients/{clientId}/dashboard/website': {
      get: {
        tags:    ['Dashboard'],
        summary: 'Website / Organic (GA4) summary',
        description: 'Pass `locationId` only when `capabilities.websiteSplitByLocation` is true.',
        parameters: [
          { name: 'clientId',   in: 'path',  required: true,  schema: { type: 'string' } },
          { name: 'startDate',  in: 'query', required: false, schema: { type: 'string', format: 'date' } },
          { name: 'endDate',    in: 'query', required: false, schema: { type: 'string', format: 'date' } },
          { name: 'locationId', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'WebsiteSummary object' } },
      },
    },

    '/api/v1/clients/{clientId}/dashboard/gmb': {
      get: {
        tags:    ['Dashboard'],
        summary: 'Google My Business — impressions, calls, directions, website clicks by listing',
        parameters: [
          { name: 'clientId',  in: 'path',  required: true,  schema: { type: 'string' } },
          { name: 'startDate', in: 'query', required: false, schema: { type: 'string', format: 'date' }, example: '2026-04-01' },
          { name: 'endDate',   in: 'query', required: false, schema: { type: 'string', format: 'date' }, example: '2026-05-22' },
        ],
        responses: {
          '200': {
            description: 'GmbSummary — hasData: false if no listings or no synced data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    hasData:             { type: 'boolean' },
                    totalImpressions:    { type: 'integer' },
                    totalCalls:          { type: 'integer' },
                    totalDirections:     { type: 'integer' },
                    totalWebsiteClicks:  { type: 'integer' },
                    byListing: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          listingId:    { type: 'string' },
                          name:         { type: 'string' },
                          impressions:  { type: 'integer' },
                          calls:        { type: 'integer' },
                          directions:   { type: 'integer' },
                          websiteClicks:{ type: 'integer' },
                        },
                      },
                    },
                    dailyTrend: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          date:         { type: 'string', format: 'date' },
                          impressions:  { type: 'integer' },
                          calls:        { type: 'integer' },
                          directions:   { type: 'integer' },
                          websiteClicks:{ type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/clients/{clientId}/dashboard/funnel-roi': {
      get: {
        tags:    ['Dashboard'],
        summary: 'Funnel stages + blended ROI',
        parameters: [
          { name: 'clientId',  in: 'path',  required: true,  schema: { type: 'string' } },
          { name: 'startDate', in: 'query', required: false, schema: { type: 'string', format: 'date' } },
          { name: 'endDate',   in: 'query', required: false, schema: { type: 'string', format: 'date' } },
        ],
        responses: { '200': { description: 'FunnelRoiSummary object' } },
      },
    },

    // ── Leads ─────────────────────────────────────────────────────────────────
    '/api/v1/clients/{clientId}/leads': {
      get: {
        tags:    ['Leads'],
        summary: 'List leads (paginated)',
        parameters: [
          { name: 'clientId', in: 'path',  required: true,  schema: { type: 'string' } },
          { name: 'page',     in: 'query', required: false, schema: { type: 'integer', default: 1 } },
          { name: 'limit',    in: 'query', required: false, schema: { type: 'integer', default: 20 } },
          { name: 'status',   in: 'query', required: false, schema: { type: 'string' } },
          { name: 'source',   in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Paginated leads' } },
      },
      post: {
        tags:       ['Leads'],
        summary:    'Create lead',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content:  { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { '201': { description: 'Lead created' } },
      },
    },

    '/api/v1/clients/{clientId}/leads/stats': {
      get: {
        tags:    ['Leads'],
        summary: 'Lead statistics by source / status',
        parameters: [
          { name: 'clientId',  in: 'path',  required: true,  schema: { type: 'string' } },
          { name: 'startDate', in: 'query', required: false, schema: { type: 'string', format: 'date' } },
          { name: 'endDate',   in: 'query', required: false, schema: { type: 'string', format: 'date' } },
        ],
        responses: { '200': { description: 'Lead stats object' } },
      },
    },

    // ── Sync ──────────────────────────────────────────────────────────────────
    '/api/v1/clients/{clientId}/sync/trigger': {
      post: {
        tags:    ['Sync'],
        summary: 'Trigger manual sync (fire and forget)',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  providers: { type: 'array', items: { type: 'string', enum: ['GOOGLE_ADS', 'META_ADS', 'GA4', 'GMB'] } },
                  startDate: { type: 'string', format: 'date' },
                  endDate:   { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: { '200': { description: '{ queued: true }' } },
      },
    },

    '/api/v1/clients/{clientId}/sync/logs': {
      get: {
        tags:       ['Sync'],
        summary:    'Sync logs — last 50 entries',
        parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'string' } }],
        responses:  { '200': { description: 'Array of SyncLog records' } },
      },
    },

    // ── Webhooks ──────────────────────────────────────────────────────────────
    '/api/v1/webhooks/exotel/call': {
      post: {
        tags:     ['Webhooks'],
        summary:  'Exotel call-completed callback',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                description: 'Exotel call payload (CallSid, From, To, Direction, Status, Duration, CustomField)',
              },
            },
          },
        },
        responses: { '200': { description: '{ received: true }' } },
      },
    },

    '/api/v1/webhooks/ghl/lead': {
      post: {
        tags:     ['Webhooks'],
        summary:  'GoHighLevel new-lead callback',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                description: 'GHL contact/lead payload (contactId, firstName, lastName, phone, email, source, customFields, locationId)',
              },
            },
          },
        },
        responses: { '200': { description: '{ received: true }' } },
      },
    },

    // ── Google OAuth ──────────────────────────────────────────────────────────
    '/api/v1/google/connect': {
      get: {
        tags:    ['Google OAuth'],
        summary: 'Connect agency Google account — redirects to consent screen',
        description: 'Agency admin only. Pass `?token=<accessToken>` when opening in a browser (browsers cannot set the Authorization header on redirects).',
        parameters: [{ name: 'token', in: 'query', required: false, schema: { type: 'string' } }],
        responses: {
          '302': { description: 'Redirect to Google OAuth screen' },
          '403': { description: 'Agency admin access required', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    '/api/v1/google/callback': {
      get: {
        tags:     ['Google OAuth'],
        summary:  'Google OAuth callback — called automatically by Google',
        security: [],
        parameters: [{ name: 'code', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Agency Google account connected' } },
      },
    },

    '/api/v1/google/save-token': {
      post: {
        tags:    ['Google OAuth'],
        summary: 'Manually save a Google refresh token (e.g. from OAuth Playground)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string', example: '1//0e...' },
                  accountEmail: { type: 'string', example: 'dental@adhubdigital.co' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Refresh token saved — GA4 sync is ready' },
          '400': { description: 'refreshToken is required' },
          '403': { description: 'Agency admin access required' },
        },
      },
    },
  },
}
