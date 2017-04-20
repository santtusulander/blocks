import React from 'react'
import { FormattedMessage } from 'react-intl'

export const ACCOUNT_TYPE_CONTENT_PROVIDER = 1;
export const ACCOUNT_TYPE_SERVICE_PROVIDER = 2;
export const ACCOUNT_TYPE_CLOUD_PROVIDER = 3;

export const ACCOUNT_TYPES = [
  { value: ACCOUNT_TYPE_CONTENT_PROVIDER, label: 'Content Provider' },
  { value: ACCOUNT_TYPE_SERVICE_PROVIDER, label: 'Service Provider' },
  { value: ACCOUNT_TYPE_CLOUD_PROVIDER,   label: 'Cloud Provider' }
]

export const FILTERED_ACCOUNT_TYPES = ACCOUNT_TYPES.filter(type => type.value !== ACCOUNT_TYPE_CLOUD_PROVIDER)

export const ACCOUNT_TYPE_OPTIONS = FILTERED_ACCOUNT_TYPES.map(e => {
  return [e.value, e.label]
});

export const SERVICE_TYPES = [
  { value: 101, label: 'UDN Network Partner - On-Net', accountTypes: [ACCOUNT_TYPE_SERVICE_PROVIDER] },
  { value: 1, label: 'Media Delivery', accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] }
  /* Commented out as these cannot be set at the moment
  add as part of UDNP-1713

  { value: 2, label: 'Content Targeting', accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] },
  value: 3, label: 'Token Auth', accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] }*/
  // Not in 0.7 { value: 'storage', label: 'Storage', accountType: ACCOUNT_TYPE_CLOUD_PROVIDER }
]

export const BRANDS = [
  { id: 'udn', brandName: 'UDN' }
]

export const BRAND_OPTIONS = BRANDS.map(e => {
  return [e.id, e.brandName]
});

export const ROLES_MAPPING = [
  { id: 1, accountTypes: [ACCOUNT_TYPE_CLOUD_PROVIDER] },
  { id: 2, accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] },
  { id: 3, accountTypes: [ACCOUNT_TYPE_SERVICE_PROVIDER] },
  { id: 4, accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] },
  { id: 5, accountTypes: [ACCOUNT_TYPE_SERVICE_PROVIDER] },
  { id: 9, accountTypes: [ACCOUNT_TYPE_CLOUD_PROVIDER] },
  { id: 10, accountTypes: [ACCOUNT_TYPE_CLOUD_PROVIDER] }
]

export const FLOW_DIRECTION_TYPES = [
  { value: 'egress', label: <FormattedMessage id="portal.account.chargeNumbersForm.egress.title"/> },
  { value: 'midgress', label: <FormattedMessage id="portal.account.chargeNumbersForm.midgress.title"/> },
  { value: 'ingress', label: <FormattedMessage id="portal.account.chargeNumbersForm.ingress.title"/> }
]

export const DNS_MIN_REFRESH = 0
export const DNS_MIN_TTL = 0
export const DNS_MAX_TTL = 2147483647
export const DNS_MIN_PRIO = 0
export const DNS_MAX_PRIO = 999

export const REGION_LOCATION_TYPE = 'region'
export const GLOBAL_LOCATION_TYPE = 'global'
