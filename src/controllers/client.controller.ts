import { Response, NextFunction } from 'express'
import { ServiceType } from '../generated/prisma'
import { AuthRequest } from '../types'
import { sendSuccess, sendCreated } from '../helpers/response'
import * as clientService from '../services/client.service'

// ─── Clients ──────────────────────────────────────────────────────────────────

export const getClients = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // SUPER_ADMIN sees all; agency roles see only their agency's clients
    const agencyId = req.user!.role === 'SUPER_ADMIN' ? undefined : req.user!.agencyId
    const clients = await clientService.getAllClients(agencyId)
    return sendSuccess(res, clients)
  } catch (error) {
    return next(error)
  }
}

export const getClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const client = await clientService.getClientById(req.params.clientId)
    return sendSuccess(res, client)
  } catch (error) {
    return next(error)
  }
}

export const createClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const client = await clientService.createClient(req.body)
    return sendCreated(res, client, 'Client created')
  } catch (error) {
    return next(error)
  }
}

export const updateClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const client = await clientService.updateClient(req.params.clientId, req.body)
    return sendSuccess(res, client, 'Client updated')
  } catch (error) {
    return next(error)
  }
}

// ─── Capabilities ─────────────────────────────────────────────────────────────

export const getCapabilities = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const capabilities = await clientService.getClientCapabilities(req.params.clientId)
    return sendSuccess(res, capabilities)
  } catch (error) {
    return next(error)
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const getServices = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const services = await clientService.getClientServices(req.params.clientId)
    return sendSuccess(res, services)
  } catch (error) {
    return next(error)
  }
}

export const configureServices = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const result = await clientService.configureServices(clientId, req.body.services as ServiceType[])
    return sendSuccess(res, result, 'Services configured')
  } catch (error) {
    return next(error)
  }
}

export const toggleService = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, service } = req.params
    const { isActive, notes } = req.body
    const result = await clientService.toggleService(clientId, service as ServiceType, isActive, notes)
    return sendSuccess(res, result, `Service ${isActive ? 'enabled' : 'disabled'}`)
  } catch (error) {
    return next(error)
  }
}

// ─── Locations ────────────────────────────────────────────────────────────────

export const getLocations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const locations = await clientService.getLocations(req.params.clientId)
    return sendSuccess(res, locations)
  } catch (error) {
    return next(error)
  }
}

export const createLocation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const location = await clientService.createLocation(req.params.clientId, req.body)
    return sendCreated(res, location, 'Location created')
  } catch (error) {
    return next(error)
  }
}

export const updateLocation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, locationId } = req.params
    const location = await clientService.updateLocation(locationId, clientId, req.body)
    return sendSuccess(res, location, 'Location updated')
  } catch (error) {
    return next(error)
  }
}

export const deleteLocation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, locationId } = req.params
    await clientService.deleteLocation(locationId, clientId)
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

// ─── GMB Listings ─────────────────────────────────────────────────────────────

export const getGmbListings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, locationId } = req.params
    const listings = await clientService.getGmbListings(locationId, clientId)
    return sendSuccess(res, listings)
  } catch (error) {
    return next(error)
  }
}

export const addGmbListing = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, locationId } = req.params
    const listing = await clientService.addGmbListing(locationId, clientId, req.body)
    return sendCreated(res, listing, 'GMB listing added')
  } catch (error) {
    return next(error)
  }
}

export const deleteGmbListing = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, locationId, listingId } = req.params
    await clientService.deleteGmbListing(listingId, locationId, clientId)
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

// ─── Integrations ─────────────────────────────────────────────────────────────

export const getIntegrations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const integrations = await clientService.getIntegrations(req.params.clientId)
    return sendSuccess(res, integrations)
  } catch (error) {
    return next(error)
  }
}

export const upsertIntegration = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const integration = await clientService.upsertIntegration(req.params.clientId, req.body)
    return sendSuccess(res, integration, 'Integration saved')
  } catch (error) {
    return next(error)
  }
}

export const toggleIntegration = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, integrationId } = req.params
    const integration = await clientService.toggleIntegration(integrationId, clientId)
    return sendSuccess(res, integration, 'Integration toggled')
  } catch (error) {
    return next(error)
  }
}
