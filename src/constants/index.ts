// Call is "qualified" if answered AND duration >= this (seconds)
export const QUALIFIED_CALL_SECONDS = 60

// Funnel conversion thresholds (%) — below these = RED in dashboard
export const FUNNEL_THRESHOLDS = {
  LEADS_TO_APPOINTMENT: 5,
  APPOINTMENT_TO_SHOWED: 30,
  SHOWED_TO_TREATMENT: 50,
}

// Pagination defaults
export const PAGE_DEFAULT = 1
export const LIMIT_DEFAULT = 20
export const LIMIT_MAX = 100

// Sync providers
export const SYNC_PROVIDERS = {
  GOOGLE_ADS: 'GOOGLE_ADS',
  META_ADS:   'META_ADS',
  GA4:        'GA4',
  EXOTEL:     'EXOTEL',
  GHL:        'GHL',
} as const

// Channel display names for frontend
export const CHANNEL_LABELS: Record<string, string> = {
  GOOGLE_ADS:    'Google Ads',
  META_ADS:      'Meta / Facebook',
  SEO_ORGANIC:   'Organic Search',
  GBP:           'Google Business Profile',
  ORGANIC_SOCIAL:'Organic Social',
  WHATSAPP:      'WhatsApp',
  DIRECT:        'Direct',
  UNKNOWN:       'Unknown',
}

// Lead stage display names
export const STAGE_LABELS: Record<string, string> = {
  NEW:                   'New',
  CONTACTED:             'Contacted',
  APPOINTMENT_CONFIRMED: 'Appointment Confirmed',
  SECOND_CONSULTATION:   '2nd Consultation',
  TREATMENT_DONE:        'Treatment Done',
  SHOWED_UP:             'Showed Up',
  NOT_PICKED:            'Not Picked',
  LOST:                  'Lost',
  UNKNOWN:               'Unknown',
}
