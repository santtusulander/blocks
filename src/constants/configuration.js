import { FormattedMessage } from 'react-intl'

export const deploymentModes = {
  production: 'portal.configuration.details.deploymentMode.production',
  trial: 'portal.configuration.details.deploymentMode.trial',
  unknown: 'portal.configuration.details.deploymentMode.unknown'
}

export const VOD_SERVICE_ID = 3

export const TOKEN_AUTH_STATIC = 'standard'
export const TOKEN_AUTH_STREAMING = 'on_demand_hls'
export const TTL_DEFAULT = 6 * 60 * 60 // 6 hours in seconds

export const SCHEMA_OPTIONS = [
  {label: <FormattedMessage id="portal.policy.edit.tokenauth.schema.ip.text"/>, value: 'IP'},
  {label: <FormattedMessage id="portal.policy.edit.tokenauth.schema.url.text"/>, value: 'URL'},
  {label: <FormattedMessage id="portal.policy.edit.tokenauth.schema.referrer.text"/>, value: 'REFERRER'},
  {label: <FormattedMessage id="portal.policy.edit.tokenauth.schema.user_agent.text"/>, value: 'USER_AGENT'},
  {label: <FormattedMessage id="portal.policy.edit.tokenauth.schema.expires.text"/>, value: 'EXPIRES'},
  {label: <FormattedMessage id="portal.policy.edit.tokenauth.schema.end_date.text"/>, value: 'END_DATE'}
]

export const ENCRIPTION_OPTIONS = [
  {label: 'HMAC-SHA1', value: 'HMAC_SHA1'},
  {label: 'HMAC-SHA256', value: 'HMAC_SHA256'},
  {label: 'HMAC-MD5', value: 'HMAC_MD5'},
  {label: 'MD5', value: 'MD5'}
]

export const SCHEMA_DEFAULT = ['URL']
export const ENCRIPTION_DEFAULT = 'HMAC_SHA1'
