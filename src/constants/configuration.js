export const deploymentModes = {
  production: 'portal.configuration.details.deploymentMode.production',
  trial: 'portal.configuration.details.deploymentMode.trial',
  unknown: 'portal.configuration.details.deploymentMode.unknown'
}

export const CIS_ORIGIN_HOST_PORT = 8082

export const TOKEN_AUTH_STATIC = 'standard'
export const TOKEN_AUTH_STREAMING = 'on_demand_hls'
export const TTL_DEFAULT = 6 * 60 * 60 // 6 hours in seconds

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

export const SCHEMA_DEFAULT = ['URL']
export const ENCRYPTION_DEFAULT = 'HMAC_SHA1'
export const STREAMING_ENCRYPTION_DEFAULT = 'HMAC_SHA1'

export const MIN_TTL = 1
export const MAX_TTL = 2147483647

export const CT_DEFAULT_STATUS_CODE = 200
