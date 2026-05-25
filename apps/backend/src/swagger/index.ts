import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger'
import { env } from '../config/env'
import logger from '../config/logger'

export const mountSwagger = (app: Express): void => {
  // Only expose Swagger UI in non-production environments
  if (env.isProd) return

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Attribution Dashboard API',
      customCss: `
        .swagger-ui .topbar { background-color: #1a1a2e; }
        .swagger-ui .topbar-wrapper img { content: none; }
        .swagger-ui .topbar-wrapper::after {
          content: 'Attribution Dashboard API';
          color: white; font-size: 18px; font-weight: bold;
        }
      `,
      swaggerOptions: {
        persistAuthorization:    true,   // keeps the token between page refreshes
        displayRequestDuration:  true,
        filter:                  true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth:  2,
      },
    })
  )

  // Raw JSON spec — useful for importing into Postman / Insomnia
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  logger.info(`Swagger UI  → http://localhost:${env.PORT}/api/docs`)
  logger.info(`Swagger JSON → http://localhost:${env.PORT}/api/docs.json`)
}
