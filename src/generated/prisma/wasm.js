
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  isActive: 'isActive',
  lastLoginAt: 'lastLoginAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  agencyId: 'agencyId',
  clientId: 'clientId'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.AgencyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  industry: 'industry',
  isActive: 'isActive',
  websiteSplitByLocation: 'websiteSplitByLocation',
  isDataInitialized: 'isDataInitialized',
  initialSyncDays: 'initialSyncDays',
  lastSuccessfulSyncAt: 'lastSuccessfulSyncAt',
  crmLastSyncAt: 'crmLastSyncAt',
  syncFailureCount: 'syncFailureCount',
  isSyncPaused: 'isSyncPaused',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  agencyId: 'agencyId'
};

exports.Prisma.ClientServiceScalarFieldEnum = {
  id: 'id',
  service: 'service',
  isActive: 'isActive',
  notes: 'notes',
  configuredAt: 'configuredAt',
  updatedAt: 'updatedAt',
  clientId: 'clientId'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  city: 'city',
  address: 'address',
  trackingPhone: 'trackingPhone',
  realPhone: 'realPhone',
  crmLocationId: 'crmLocationId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  clientId: 'clientId'
};

exports.Prisma.GmbListingScalarFieldEnum = {
  id: 'id',
  listingId: 'listingId',
  name: 'name',
  address: 'address',
  trackingPhone: 'trackingPhone',
  realPhone: 'realPhone',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  locationId: 'locationId'
};

exports.Prisma.UserLocationAccessScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  clientId: 'clientId',
  locationId: 'locationId',
  createdAt: 'createdAt'
};

exports.Prisma.IntegrationScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  isActive: 'isActive',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  tokenExpiry: 'tokenExpiry',
  accountId: 'accountId',
  extraConfig: 'extraConfig',
  credentials: 'credentials',
  lastSyncAt: 'lastSyncAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  clientId: 'clientId'
};

exports.Prisma.MappingScalarFieldEnum = {
  id: 'id',
  type: 'type',
  ruleKey: 'ruleKey',
  ruleValue: 'ruleValue',
  createdAt: 'createdAt',
  clientId: 'clientId'
};

exports.Prisma.CampaignScalarFieldEnum = {
  id: 'id',
  externalId: 'externalId',
  name: 'name',
  channel: 'channel',
  status: 'status',
  objective: 'objective',
  biddingStrategyType: 'biddingStrategyType',
  dailyBudget: 'dailyBudget',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  clientId: 'clientId'
};

exports.Prisma.AdSetScalarFieldEnum = {
  id: 'id',
  externalId: 'externalId',
  name: 'name',
  targeting: 'targeting',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  campaignId: 'campaignId'
};

exports.Prisma.AdScalarFieldEnum = {
  id: 'id',
  externalId: 'externalId',
  name: 'name',
  creative: 'creative',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  adSetId: 'adSetId'
};

exports.Prisma.CampaignMetricScalarFieldEnum = {
  id: 'id',
  date: 'date',
  impressions: 'impressions',
  clicks: 'clicks',
  spend: 'spend',
  conversions: 'conversions',
  ctr: 'ctr',
  cpc: 'cpc',
  cpm: 'cpm',
  cpa: 'cpa',
  roas: 'roas',
  reach: 'reach',
  frequency: 'frequency',
  leads: 'leads',
  calls: 'calls',
  appointments: 'appointments',
  revenue: 'revenue',
  interactions: 'interactions',
  convRate: 'convRate',
  activeViewImpressions: 'activeViewImpressions',
  activeViewCpm: 'activeViewCpm',
  createdAt: 'createdAt',
  campaignId: 'campaignId'
};

exports.Prisma.AdSetMetricScalarFieldEnum = {
  id: 'id',
  date: 'date',
  impressions: 'impressions',
  clicks: 'clicks',
  spend: 'spend',
  conversions: 'conversions',
  ctr: 'ctr',
  cpc: 'cpc',
  leads: 'leads',
  createdAt: 'createdAt',
  adSetId: 'adSetId'
};

exports.Prisma.AdMetricScalarFieldEnum = {
  id: 'id',
  date: 'date',
  impressions: 'impressions',
  clicks: 'clicks',
  spend: 'spend',
  conversions: 'conversions',
  ctr: 'ctr',
  cpc: 'cpc',
  leads: 'leads',
  postEngagement: 'postEngagement',
  createdAt: 'createdAt',
  adId: 'adId'
};

exports.Prisma.WebsiteMetricScalarFieldEnum = {
  id: 'id',
  date: 'date',
  channel: 'channel',
  deviceCategory: 'deviceCategory',
  sessions: 'sessions',
  engagedSessions: 'engagedSessions',
  activeUsers30d: 'activeUsers30d',
  formLeads: 'formLeads',
  callLeads: 'callLeads',
  leadConvRate: 'leadConvRate',
  bounceRate: 'bounceRate',
  landingPage: 'landingPage',
  createdAt: 'createdAt',
  clientId: 'clientId',
  locationId: 'locationId'
};

exports.Prisma.LeadScalarFieldEnum = {
  id: 'id',
  externalId: 'externalId',
  name: 'name',
  phone: 'phone',
  email: 'email',
  source: 'source',
  channel: 'channel',
  status: 'status',
  utmSource: 'utmSource',
  utmMedium: 'utmMedium',
  utmCampaign: 'utmCampaign',
  utmContent: 'utmContent',
  utmTerm: 'utmTerm',
  gclid: 'gclid',
  fbclid: 'fbclid',
  keyword: 'keyword',
  landingPage: 'landingPage',
  adSetName: 'adSetName',
  adName: 'adName',
  isQualified: 'isQualified',
  qualifiedAt: 'qualifiedAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  clientId: 'clientId',
  locationId: 'locationId',
  campaignId: 'campaignId'
};

exports.Prisma.LeadStageHistoryScalarFieldEnum = {
  id: 'id',
  stage: 'stage',
  note: 'note',
  createdAt: 'createdAt',
  leadId: 'leadId'
};

exports.Prisma.CallLogScalarFieldEnum = {
  id: 'id',
  externalId: 'externalId',
  direction: 'direction',
  duration: 'duration',
  status: 'status',
  recordingUrl: 'recordingUrl',
  callerNumber: 'callerNumber',
  receiverNumber: 'receiverNumber',
  source: 'source',
  channel: 'channel',
  outcome: 'outcome',
  isQualified: 'isQualified',
  aiSummary: 'aiSummary',
  gclid: 'gclid',
  fbclid: 'fbclid',
  keyword: 'keyword',
  utmSource: 'utmSource',
  utmCampaign: 'utmCampaign',
  callAt: 'callAt',
  createdAt: 'createdAt',
  clientId: 'clientId',
  locationId: 'locationId',
  leadId: 'leadId'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  scheduledAt: 'scheduledAt',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  leadId: 'leadId'
};

exports.Prisma.FunnelSnapshotScalarFieldEnum = {
  id: 'id',
  date: 'date',
  channel: 'channel',
  leadsReceived: 'leadsReceived',
  apptConfirmed: 'apptConfirmed',
  secondConsult: 'secondConsult',
  calledNotPicked: 'calledNotPicked',
  treatmentDone: 'treatmentDone',
  showedUp: 'showedUp',
  createdAt: 'createdAt',
  clientId: 'clientId'
};

exports.Prisma.RoiBlendScalarFieldEnum = {
  id: 'id',
  date: 'date',
  channel: 'channel',
  totalSpend: 'totalSpend',
  totalLeads: 'totalLeads',
  qualifiedLeads: 'qualifiedLeads',
  appointments: 'appointments',
  revenue: 'revenue',
  cpl: 'cpl',
  roas: 'roas',
  createdAt: 'createdAt',
  clientId: 'clientId'
};

exports.Prisma.SyncLogScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  status: 'status',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  recordsSync: 'recordsSync',
  errorMsg: 'errorMsg',
  clientId: 'clientId'
};

exports.Prisma.GoogleAgencyAuthScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  accountEmail: 'accountEmail',
  refreshTokenEncrypted: 'refreshTokenEncrypted',
  scopes: 'scopes',
  status: 'status',
  lastError: 'lastError',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.Ga4DailyOverviewScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  propertyId: 'propertyId',
  date: 'date',
  sessions: 'sessions',
  activeUsers: 'activeUsers',
  newUsers: 'newUsers',
  engagedSessions: 'engagedSessions',
  engagementRate: 'engagementRate',
  eventCount: 'eventCount',
  keyEvents: 'keyEvents',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.Ga4ChannelMetricsScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  propertyId: 'propertyId',
  date: 'date',
  channelGroup: 'channelGroup',
  source: 'source',
  medium: 'medium',
  campaign: 'campaign',
  sessions: 'sessions',
  activeUsers: 'activeUsers',
  newUsers: 'newUsers',
  engagedSessions: 'engagedSessions',
  engagementRate: 'engagementRate',
  eventCount: 'eventCount',
  keyEvents: 'keyEvents',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.Ga4LandingPageMetricsScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  propertyId: 'propertyId',
  date: 'date',
  landingPage: 'landingPage',
  sessions: 'sessions',
  activeUsers: 'activeUsers',
  engagedSessions: 'engagedSessions',
  engagementRate: 'engagementRate',
  eventCount: 'eventCount',
  keyEvents: 'keyEvents',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.Ga4EventMetricsScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  propertyId: 'propertyId',
  date: 'date',
  eventName: 'eventName',
  eventCount: 'eventCount',
  activeUsers: 'activeUsers',
  keyEvents: 'keyEvents',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.Ga4OrganicDailyScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  date: 'date',
  channel: 'channel',
  landingPage: 'landingPage',
  sessions: 'sessions',
  users: 'users',
  pageViews: 'pageViews',
  bounceRate: 'bounceRate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GoogleAdsDailyScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  campaignId: 'campaignId',
  campaignName: 'campaignName',
  date: 'date',
  impressions: 'impressions',
  clicks: 'clicks',
  cost: 'cost',
  conversions: 'conversions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MetaAdsDailyScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  campaignId: 'campaignId',
  campaignName: 'campaignName',
  date: 'date',
  impressions: 'impressions',
  clicks: 'clicks',
  spend: 'spend',
  leads: 'leads',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GmbDailyScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  listingId: 'listingId',
  date: 'date',
  impressionsDesktopMaps: 'impressionsDesktopMaps',
  impressionsDesktopSearch: 'impressionsDesktopSearch',
  impressionsMobileMaps: 'impressionsMobileMaps',
  impressionsMobileSearch: 'impressionsMobileSearch',
  directionRequests: 'directionRequests',
  callClicks: 'callClicks',
  websiteClicks: 'websiteClicks',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CrmOpportunityScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  crmOpportunityId: 'crmOpportunityId',
  pipelineId: 'pipelineId',
  pipelineStageId: 'pipelineStageId',
  pipelineStageName: 'pipelineStageName',
  status: 'status',
  monetaryValue: 'monetaryValue',
  contactId: 'contactId',
  source: 'source',
  medium: 'medium',
  campaign: 'campaign',
  appointmentStatus: 'appointmentStatus',
  crmCreatedAt: 'crmCreatedAt',
  crmUpdatedAt: 'crmUpdatedAt',
  syncedAt: 'syncedAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SyncRunScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  status: 'status',
  startedAt: 'startedAt',
  finishedAt: 'finishedAt',
  dateFrom: 'dateFrom',
  dateTo: 'dateTo',
  error: 'error'
};

exports.Prisma.SyncStepRunScalarFieldEnum = {
  id: 'id',
  syncRunId: 'syncRunId',
  stepName: 'stepName',
  status: 'status',
  rowsProcessed: 'rowsProcessed',
  error: 'error',
  startedAt: 'startedAt',
  finishedAt: 'finishedAt'
};

exports.Prisma.NormalisationAuditScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  tableName: 'tableName',
  original: 'original',
  normalised: 'normalised',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  AGENCY_ADMIN: 'AGENCY_ADMIN',
  AGENCY_MEMBER: 'AGENCY_MEMBER',
  CLIENT_ADMIN: 'CLIENT_ADMIN',
  CLIENT_MEMBER: 'CLIENT_MEMBER'
};

exports.ServiceType = exports.$Enums.ServiceType = {
  GOOGLE_ADS: 'GOOGLE_ADS',
  META_ADS: 'META_ADS',
  WEBSITE_ORGANIC: 'WEBSITE_ORGANIC',
  GMB: 'GMB',
  WHATSAPP: 'WHATSAPP',
  SEO: 'SEO'
};

exports.IntegrationProvider = exports.$Enums.IntegrationProvider = {
  GOOGLE_ADS: 'GOOGLE_ADS',
  META_ADS: 'META_ADS',
  GOOGLE_ANALYTICS: 'GOOGLE_ANALYTICS',
  GOOGLE_SEARCH_CONSOLE: 'GOOGLE_SEARCH_CONSOLE',
  GMB: 'GMB',
  CRM: 'CRM',
  CALLHIPPO: 'CALLHIPPO',
  EXOTEL: 'EXOTEL',
  GOHIGHLEVEL: 'GOHIGHLEVEL'
};

exports.MappingType = exports.$Enums.MappingType = {
  SOURCE: 'SOURCE',
  CAMPAIGN: 'CAMPAIGN',
  LOCATION: 'LOCATION',
  PIPELINE_STAGE: 'PIPELINE_STAGE'
};

exports.ChannelType = exports.$Enums.ChannelType = {
  GOOGLE_ADS: 'GOOGLE_ADS',
  META_ADS: 'META_ADS',
  SEO_ORGANIC: 'SEO_ORGANIC',
  GBP: 'GBP',
  ORGANIC_SOCIAL: 'ORGANIC_SOCIAL',
  WHATSAPP: 'WHATSAPP',
  DIRECT: 'DIRECT',
  UNKNOWN: 'UNKNOWN'
};

exports.LeadSource = exports.$Enums.LeadSource = {
  GOOGLE_ADS: 'GOOGLE_ADS',
  META_ADS: 'META_ADS',
  GBP: 'GBP',
  ORGANIC_SEARCH: 'ORGANIC_SEARCH',
  ORGANIC_SOCIAL: 'ORGANIC_SOCIAL',
  WHATSAPP: 'WHATSAPP',
  DIRECT: 'DIRECT',
  REFERRAL: 'REFERRAL',
  FORM: 'FORM',
  UNKNOWN: 'UNKNOWN'
};

exports.LeadStatus = exports.$Enums.LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  APPOINTMENT_CONFIRMED: 'APPOINTMENT_CONFIRMED',
  SECOND_CONSULTATION: 'SECOND_CONSULTATION',
  TREATMENT_DONE: 'TREATMENT_DONE',
  SHOWED_UP: 'SHOWED_UP',
  NOT_PICKED: 'NOT_PICKED',
  LOST: 'LOST',
  UNKNOWN: 'UNKNOWN'
};

exports.SyncStatus = exports.$Enums.SyncStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PARTIAL: 'PARTIAL'
};

exports.Prisma.ModelName = {
  User: 'User',
  RefreshToken: 'RefreshToken',
  Agency: 'Agency',
  Client: 'Client',
  ClientService: 'ClientService',
  Location: 'Location',
  GmbListing: 'GmbListing',
  UserLocationAccess: 'UserLocationAccess',
  Integration: 'Integration',
  Mapping: 'Mapping',
  Campaign: 'Campaign',
  AdSet: 'AdSet',
  Ad: 'Ad',
  CampaignMetric: 'CampaignMetric',
  AdSetMetric: 'AdSetMetric',
  AdMetric: 'AdMetric',
  WebsiteMetric: 'WebsiteMetric',
  Lead: 'Lead',
  LeadStageHistory: 'LeadStageHistory',
  CallLog: 'CallLog',
  Appointment: 'Appointment',
  FunnelSnapshot: 'FunnelSnapshot',
  RoiBlend: 'RoiBlend',
  SyncLog: 'SyncLog',
  GoogleAgencyAuth: 'GoogleAgencyAuth',
  Ga4DailyOverview: 'Ga4DailyOverview',
  Ga4ChannelMetrics: 'Ga4ChannelMetrics',
  Ga4LandingPageMetrics: 'Ga4LandingPageMetrics',
  Ga4EventMetrics: 'Ga4EventMetrics',
  Ga4OrganicDaily: 'Ga4OrganicDaily',
  GoogleAdsDaily: 'GoogleAdsDaily',
  MetaAdsDaily: 'MetaAdsDaily',
  GmbDaily: 'GmbDaily',
  CrmOpportunity: 'CrmOpportunity',
  SyncRun: 'SyncRun',
  SyncStepRun: 'SyncStepRun',
  NormalisationAudit: 'NormalisationAudit'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
