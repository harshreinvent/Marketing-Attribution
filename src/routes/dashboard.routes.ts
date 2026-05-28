import { Router } from 'express'
import { executiveSummary, googleAdsSummary, metaAdsSummary, websiteSummary, gmbSummary, funnelRoi } from '../controllers/dashboard.controller'
import { authenticate } from '../middleware/authenticate'
import { enforceClientScope } from '../middleware/authorize'

// mergeParams: true so :clientId from parent router is accessible inside controllers
export const dashboardRouter = Router({ mergeParams: true })

dashboardRouter.use(authenticate, enforceClientScope)

// GET /api/v1/clients/:clientId/dashboard/executive?startDate=&endDate=
dashboardRouter.get('/executive',   executiveSummary)

// GET /api/v1/clients/:clientId/dashboard/google-ads?startDate=&endDate=
dashboardRouter.get('/google-ads',  googleAdsSummary)

// GET /api/v1/clients/:clientId/dashboard/meta-ads?startDate=&endDate=
dashboardRouter.get('/meta-ads',    metaAdsSummary)

// GET /api/v1/clients/:clientId/dashboard/website?startDate=&endDate=&locationId=
dashboardRouter.get('/website',     websiteSummary)

// GET /api/v1/clients/:clientId/dashboard/gmb?startDate=&endDate=
dashboardRouter.get('/gmb',         gmbSummary)

// GET /api/v1/clients/:clientId/dashboard/funnel-roi?startDate=&endDate=
dashboardRouter.get('/funnel-roi',  funnelRoi)
