import moment from 'moment'

export const deploymentModes = {
  production: 'portal.configuration.details.deploymentMode.production',
  trial: 'portal.configuration.details.deploymentMode.trial',
  unknown: 'portal.configuration.details.deploymentMode.unknown'
}

export const serviceTypes = {
  msd: 'portal.configuration.details.serviceType.msd',
  large: 'portal.configuration.details.serviceType.large',
  unknown: 'portal.configuration.details.deploymentMode.unknown'
}

export const CIS_ORIGIN_HOST_PORT = 80

export const TOKEN_AUTH_STATIC = 'standard'
export const TOKEN_AUTH_STREAMING = 'on_demand_hls'
export const TTL_DEFAULT = 6 * 60 * 60 // 6 hours in seconds

export const SCHEMA_LABEL_MAP = {
  IP: "portal.policy.edit.tokenauth.sampleOutputDialog.table.ip.title",
  URL: "portal.policy.edit.tokenauth.sampleOutputDialog.table.url.title",
  REFERRER: "portal.policy.edit.tokenauth.sampleOutputDialog.table.referrer.title",
  USER_AGENT: "portal.policy.edit.tokenauth.sampleOutputDialog.table.user_agent.title",
  EXPIRES: "portal.policy.edit.tokenauth.sampleOutputDialog.table.expires.title"
}

export const SCHEMA_OPTIONS = [
  {label: 'portal.policy.edit.tokenauth.schema.ip.text', value: 'IP'},
  {label: 'portal.policy.edit.tokenauth.schema.url.text', value: 'URL'},
  {label: 'portal.policy.edit.tokenauth.schema.referrer.text', value: 'REFERRER'},
  {label: 'portal.policy.edit.tokenauth.schema.user_agent.text', value: 'USER_AGENT'},
  {label: 'portal.policy.edit.tokenauth.schema.end_date.text', value: 'EXPIRES'}
]

export const ENCRYPTION_OPTIONS = [
  {label: 'HMAC-SHA1', value: 'HMAC_SHA1'},
  {label: 'HMAC-SHA256', value: 'HMAC_SHA256'},
  {label: 'HMAC-MD5', value: 'HMAC_MD5'},
  {label: 'MD5', value: 'MD5'}
]

export const STREAMING_ENCRYPTION_OPTIONS = [
  {label: 'HMAC-SHA1', value: 'HMAC_SHA1'},
  {label: 'HMAC-SHA256', value: 'HMAC_SHA256'}
]

export const SAMPLE_CODE_LANGUAGE_OPTIONS = [
  {label: 'Java', value: 1},
  {label: 'Python', value: 2},
  {label: 'Javascript', value: 3}
]

export const STATIC_TOKEN_SAMPLE_VALUES = {
  IP:'10.130.1.2',
  URL: 'www.unifieddeliverynetwork.net/bigbuckbunny/stream.m3u8',
  REFERRER: 'www.video.com',
  EXPIRES: moment().add(6, 'hour'),
  USER_AGENT: navigator.userAgent
}

export const SCHEMA_DEFAULT = ['URL']
export const ENCRYPTION_DEFAULT = 'HMAC_SHA1'
export const STREAMING_ENCRYPTION_DEFAULT = 'HMAC_SHA1'
export const SAMPLE_CODE_LANGUAGE_DEFAULT = 1

export const MIN_TTL = 1
export const MAX_TTL = 2147483647

export const DEFAULT_HOST_SERVICE_TYPE = 'large'
