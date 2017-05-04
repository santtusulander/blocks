import React from 'react'
import { FormattedMessage } from 'react-intl'

export const UDN_CORE_ACCOUNT_ID = 1;

export const ACCOUNT_TYPE_CONTENT_PROVIDER = 1;
export const ACCOUNT_TYPE_SERVICE_PROVIDER = 2;
export const ACCOUNT_TYPE_CLOUD_PROVIDER = 3;

export const UDN_ADMIN_ROLE_ID = 1;
export const CP_ADMIN_ROLE_ID = 2;
export const SP_ADMIN_ROLE_ID = 3;
export const CP_USER_ROLE_ID = 4;
export const SP_USER_ROLE_ID = 5;
export const SUPER_ADMIN_ROLE_ID = 8;
export const UDN_USER_ROLE_ID = 9;

export const ACCOUNT_TYPES = [
  { value: ACCOUNT_TYPE_CONTENT_PROVIDER, label: <FormattedMessage id="portal.account.type.contentProvider"/> },
  { value: ACCOUNT_TYPE_SERVICE_PROVIDER, label: <FormattedMessage id="portal.account.type.serviceProvider"/> },
  { value: ACCOUNT_TYPE_CLOUD_PROVIDER,   label: <FormattedMessage id="portal.account.type.cloudProvider"/> }
]

export const FILTERED_ACCOUNT_TYPES = ACCOUNT_TYPES.filter(type => type.value !== ACCOUNT_TYPE_CLOUD_PROVIDER)

export const ACCOUNT_TYPE_OPTIONS = FILTERED_ACCOUNT_TYPES.map(e => {
  return [e.value, e.label]
});

export const SERVICE_TYPES = [
  { value: 101, label: <FormattedMessage id="portal.configuration.details.serviceType.networkPartnerOnNet"/>, accountTypes: [ACCOUNT_TYPE_SERVICE_PROVIDER] },
  { value: 1, label: <FormattedMessage id="portal.configuration.details.serviceType.large"/>, accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] }
]

export const BRANDS = [
  { id: 'udn', brandName: <FormattedMessage id="portal.UDN.text"/> }
]

export const BRAND_OPTIONS = BRANDS.map(e => {
  return [e.id, e.brandName]
});

export const ROLES_MAPPING = [
  { id: UDN_ADMIN_ROLE_ID, accountTypes: [ACCOUNT_TYPE_CLOUD_PROVIDER] },
  { id: CP_ADMIN_ROLE_ID, accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] },
  { id: SP_ADMIN_ROLE_ID, accountTypes: [ACCOUNT_TYPE_SERVICE_PROVIDER] },
  { id: CP_USER_ROLE_ID, accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] },
  { id: SP_USER_ROLE_ID, accountTypes: [ACCOUNT_TYPE_SERVICE_PROVIDER] },
  { id: SUPER_ADMIN_ROLE_ID, accountTypes: [ACCOUNT_TYPE_CLOUD_PROVIDER] },
  { id: UDN_USER_ROLE_ID, accountTypes: [ACCOUNT_TYPE_CLOUD_PROVIDER] }
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
