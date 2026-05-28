import { ServiceType, Prisma } from '../generated/prisma'
import db from '../config/db'
import { AppError } from '../helpers/AppError'
import {
  CreateClientDto, UpdateClientDto, CreateLocationDto,
  CreateGmbListingDto, CreateIntegrationDto,
} from '../validators/client.validator'
import { ClientCapabilities } from '../types'

// ─── Clients ──────────────────────────────────────────────────────────────────

export const getAllClients = async (agencyId?: string) => {
  return db.client.findMany({
    where:   agencyId ? { agencyId } : {},
    include: {
      services: { where: { isActive: true }, select: { service: true } },
      _count:   { select: { leads: true, locations: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const getClientById = async (clientId: string) => {
  const client = await db.client.findUnique({
    where:   { id: clientId },
    include: {
      services:     { where: { isActive: true } },
      locations:    { where: { isActive: true }, include: { gmbListings: { where: { isActive: true } } } },
      integrations: { select: { id: true, provider: true, isActive: true, lastSyncAt: true, accountId: true } },
      _count:       { select: { leads: true } },
    },
  })
  if (!client) throw new AppError('Client not found', 404)
  return client
}

export const createClient = async (dto: CreateClientDto) => {
  return db.client.create({ data: dto })
}

export const updateClient = async (clientId: string, dto: UpdateClientDto) => {
  const client = await db.client.findUnique({ where: { id: clientId } })
  if (!client) throw new AppError('Client not found', 404)
  return db.client.update({ where: { id: clientId }, data: dto })
}

// ─── Capabilities ─────────────────────────────────────────────────────────────
// Frontend calls this first — response drives which tabs to show

export const getClientCapabilities = async (clientId: string): Promise<ClientCapabilities> => {
  const [client, services, locations] = await Promise.all([
    db.client.findUnique({ where: { id: clientId }, select: { websiteSplitByLocation: true } }),
    db.clientService.findMany({ where: { clientId, isActive: true }, select: { service: true } }),
    db.location.findMany({
      where:   { clientId, isActive: true },
      include: { gmbListings: { where: { isActive: true }, select: { id: true, listingId: true, name: true, trackingPhone: true } } },
    }),
  ])

  if (!client) throw new AppError('Client not found', 404)

  const activeServices = services.map(s => s.service)

  return {
    hasGoogleAds:          activeServices.includes(ServiceType.GOOGLE_ADS),
    hasMetaAds:            activeServices.includes(ServiceType.META_ADS),
    hasWebsiteOrganic:     activeServices.includes(ServiceType.WEBSITE_ORGANIC),
    hasGmb:                activeServices.includes(ServiceType.GMB),
    hasWhatsApp:           activeServices.includes(ServiceType.WHATSAPP),
    hasSeo:                activeServices.includes(ServiceType.SEO),
    websiteSplitByLocation: client.websiteSplitByLocation,
    services:              activeServices,
    locations: locations.map(l => ({
      id: l.id, name: l.name, city: l.city,
      hasGmb: l.gmbListings.length > 0, gmbListings: l.gmbListings,
    })),
    locationCount:    locations.length,
    totalGmbListings: locations.reduce((sum, l) => sum + l.gmbListings.length, 0),
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const getClientServices = async (clientId: string) => {
  return db.clientService.findMany({ where: { clientId }, orderBy: { configuredAt: 'asc' } })
}

export const configureServices = async (clientId: string, services: ServiceType[]) => {
  return Promise.all(
    services.map(service =>
      db.clientService.upsert({
        where:  { clientId_service: { clientId, service } },
        create: { clientId, service, isActive: true },
        update: { isActive: true },
      })
    )
  )
}

export const toggleService = async (clientId: string, service: ServiceType, isActive: boolean, notes?: string) => {
  const existing = await db.clientService.findUnique({ where: { clientId_service: { clientId, service } } })
  if (!existing) throw new AppError('Service not configured for this client', 404)
  return db.clientService.update({ where: { clientId_service: { clientId, service } }, data: { isActive, notes } })
}

// ─── Locations ────────────────────────────────────────────────────────────────

export const getLocations = async (clientId: string) => {
  return db.location.findMany({
    where:   { clientId, isActive: true },
    include: { gmbListings: { where: { isActive: true } }, _count: { select: { leads: true, callLogs: true } } },
    orderBy: { name: 'asc' },
  })
}

export const createLocation = async (clientId: string, dto: CreateLocationDto) => {
  return db.location.create({ data: { ...dto, clientId }, include: { gmbListings: true } })
}

export const updateLocation = async (locationId: string, clientId: string, dto: Partial<CreateLocationDto>) => {
  const location = await db.location.findFirst({ where: { id: locationId, clientId } })
  if (!location) throw new AppError('Location not found', 404)
  return db.location.update({ where: { id: locationId }, data: dto })
}

export const deleteLocation = async (locationId: string, clientId: string) => {
  const location = await db.location.findFirst({ where: { id: locationId, clientId } })
  if (!location) throw new AppError('Location not found', 404)
  return db.location.update({ where: { id: locationId }, data: { isActive: false } })
}

// ─── GMB Listings ─────────────────────────────────────────────────────────────

export const getGmbListings = async (locationId: string, clientId: string) => {
  const location = await db.location.findFirst({ where: { id: locationId, clientId } })
  if (!location) throw new AppError('Location not found', 404)
  return db.gmbListing.findMany({ where: { locationId, isActive: true }, orderBy: { name: 'asc' } })
}

export const addGmbListing = async (locationId: string, clientId: string, dto: CreateGmbListingDto) => {
  const location = await db.location.findFirst({ where: { id: locationId, clientId } })
  if (!location) throw new AppError('Location not found', 404)
  return db.gmbListing.upsert({
    where:  { locationId_listingId: { locationId, listingId: dto.listingId } },
    create: { locationId, ...dto },
    update: { name: dto.name, address: dto.address, trackingPhone: dto.trackingPhone, realPhone: dto.realPhone, isActive: true },
  })
}

export const deleteGmbListing = async (listingId: string, locationId: string, clientId: string) => {
  const location = await db.location.findFirst({ where: { id: locationId, clientId } })
  if (!location) throw new AppError('Location not found', 404)
  const listing = await db.gmbListing.findFirst({ where: { id: listingId, locationId } })
  if (!listing) throw new AppError('GMB listing not found', 404)
  return db.gmbListing.update({ where: { id: listingId }, data: { isActive: false } })
}

// ─── Integrations ─────────────────────────────────────────────────────────────

export const getIntegrations = async (clientId: string) => {
  return db.integration.findMany({
    where:  { clientId },
    select: { id: true, provider: true, isActive: true, lastSyncAt: true, accountId: true },
  })
}

export const upsertIntegration = async (clientId: string, dto: CreateIntegrationDto) => {
  // extraConfig must satisfy Prisma's InputJsonValue — cast via unknown
  const extraConfig = dto.extraConfig as unknown as Prisma.InputJsonValue | undefined
  return db.integration.upsert({
    where:  { clientId_provider: { clientId, provider: dto.provider as any } },
    create: { clientId, ...dto, provider: dto.provider as any, extraConfig },
    update: { accessToken: dto.accessToken, refreshToken: dto.refreshToken, accountId: dto.accountId, extraConfig, isActive: true },
  })
}

export const toggleIntegration = async (integrationId: string, clientId: string) => {
  const integration = await db.integration.findFirst({ where: { id: integrationId, clientId } })
  if (!integration) throw new AppError('Integration not found', 404)
  return db.integration.update({ where: { id: integrationId }, data: { isActive: !integration.isActive } })
}
