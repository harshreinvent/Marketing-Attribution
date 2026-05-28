import { Router } from 'express'
import {
  getClients, getClient, createClient, updateClient,
  getCapabilities,
  getServices, configureServices, toggleService,
  getLocations, createLocation, updateLocation, deleteLocation,
  getGmbListings, addGmbListing, deleteGmbListing,
  getIntegrations, upsertIntegration, toggleIntegration,
} from '../controllers/client.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize, enforceClientScope } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import {
  createClientSchema,
  updateClientSchema,
  createLocationSchema,
  createGmbListingSchema,
  configureServicesSchema,
  toggleServiceSchema,
  createIntegrationSchema,
} from '../validators/client.validator'

export const clientRouter = Router()

clientRouter.use(authenticate)

// ─── Clients ──────────────────────────────────────────────────────────────────
clientRouter.get('/',           authorize('SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENCY_MEMBER'), getClients)
clientRouter.post('/',          authorize('SUPER_ADMIN', 'AGENCY_ADMIN'), validate(createClientSchema), createClient)
clientRouter.get('/:clientId',  enforceClientScope, getClient)
clientRouter.patch('/:clientId', authorize('SUPER_ADMIN', 'AGENCY_ADMIN'), validate(updateClientSchema), updateClient)

// ─── Capabilities ─────────────────────────────────────────────────────────────
clientRouter.get('/:clientId/capabilities', enforceClientScope, getCapabilities)

// ─── Services ─────────────────────────────────────────────────────────────────
clientRouter.get('/:clientId/services',          enforceClientScope, getServices)
clientRouter.post('/:clientId/services',         authorize('SUPER_ADMIN', 'AGENCY_ADMIN'), validate(configureServicesSchema), configureServices)
clientRouter.patch('/:clientId/services/:service', authorize('SUPER_ADMIN', 'AGENCY_ADMIN'), validate(toggleServiceSchema), toggleService)

// ─── Locations ────────────────────────────────────────────────────────────────
clientRouter.get('/:clientId/locations',                   enforceClientScope, getLocations)
clientRouter.post('/:clientId/locations',                  enforceClientScope, validate(createLocationSchema), createLocation)
clientRouter.patch('/:clientId/locations/:locationId',     enforceClientScope, validate(createLocationSchema), updateLocation)
clientRouter.delete('/:clientId/locations/:locationId',    enforceClientScope, deleteLocation)

// ─── GMB Listings ─────────────────────────────────────────────────────────────
clientRouter.get('/:clientId/locations/:locationId/gmb',              enforceClientScope, getGmbListings)
clientRouter.post('/:clientId/locations/:locationId/gmb',             enforceClientScope, validate(createGmbListingSchema), addGmbListing)
clientRouter.delete('/:clientId/locations/:locationId/gmb/:listingId', enforceClientScope, deleteGmbListing)

// ─── Integrations ─────────────────────────────────────────────────────────────
clientRouter.get('/:clientId/integrations',                           enforceClientScope, getIntegrations)
clientRouter.post('/:clientId/integrations',                          authorize('SUPER_ADMIN', 'AGENCY_ADMIN'), validate(createIntegrationSchema), upsertIntegration)
clientRouter.patch('/:clientId/integrations/:integrationId/toggle',   authorize('SUPER_ADMIN', 'AGENCY_ADMIN'), toggleIntegration)
