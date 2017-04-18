import Immutable from 'immutable'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { 
  MEDIA_DELIVERY_CONTENT_TARGETTING,
  MEDIA_DELIVERY_TOKEN_AUTH,
  VOD_STREAMING_TOKEN_AUTH
} from './service-permissions'

export const DEFAULT_RULE_JS = {
  rule_name: '',
  rule_body: {}
}

export const DEFAULT_CONDITION_JS = {
  type: 'equals',
  field: null,
  field_detail: '',
  value: '',
  inverted: false,
  _temp: true
}

export const DEFAULT_RULE = Immutable.fromJS(DEFAULT_RULE_JS)
export const DEFAULT_CONDITION = Immutable.fromJS(DEFAULT_CONDITION_JS)

export const POLICY_TYPES = {
  REQUEST: 'request_policy',
  RESPONSE: 'response_policy',
  FINAL_REQUEST: 'final_request_policy',
  FINAL_RESPONSE: 'final_response_policy'
}

export const availableMatches = [
  {
    key: 'request_host',
    name: 'portal.policy.edit.matchesSelection.hostname.text',
    compatibleWith: [POLICY_TYPES.REQUEST, POLICY_TYPES.FINAL_REQUEST]
  },
  {
    key: 'request_url',
    name: 'portal.policy.edit.matchesSelection.url.text',
    compatibleWith: [POLICY_TYPES.REQUEST, POLICY_TYPES.FINAL_REQUEST]
  },
  {
    key: 'request_path',
    name: 'portal.policy.edit.matchesSelection.directoryPath.text',
    compatibleWith: [POLICY_TYPES.REQUEST, POLICY_TYPES.FINAL_REQUEST]
  },
  {
    key: 'request_query_arg',
    name: 'portal.policy.edit.matchesSelection.queryString.text',
    compatibleWith: [POLICY_TYPES.REQUEST, POLICY_TYPES.FINAL_REQUEST]
  },
  {
    key: 'request_header',
    name: 'portal.policy.edit.matchesSelection.header.text',
    compatibleWith: [POLICY_TYPES.REQUEST, POLICY_TYPES.RESPONSE, POLICY_TYPES.FINAL_REQUEST, POLICY_TYPES.FINAL_RESPONSE]
  },
  {
    key: 'request_cookie',
    name: 'portal.policy.edit.matchesSelection.cookie.text',
    compatibleWith: [POLICY_TYPES.REQUEST, POLICY_TYPES.RESPONSE, POLICY_TYPES.FINAL_REQUEST, POLICY_TYPES.FINAL_RESPONSE]
  },
  {
    key: 'file_extension',
    name: 'portal.policy.edit.matchesSelection.fileExtension.text',
    compatibleWith: [POLICY_TYPES.REQUEST, POLICY_TYPES.FINAL_REQUEST]
  },
  {
    key: 'content_targeting_country_code',
    name: 'portal.policy.edit.matchesSelection.contentTargeting.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    servicePermissions: [ MEDIA_DELIVERY_CONTENT_TARGETTING ]
  },
  {
    key: 'response_code',
    name: 'portal.policy.edit.matchesSelection.responseCode.text',
    compatibleWith: [POLICY_TYPES.RESPONSE]
  },
  { // File Name (not yet implemented on backend)
    key: 'File Name',
    name: 'portal.policy.edit.matchesSelection.fileName.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  },
  { // File Type (not yet implemented on backend)
    key: 'File Type',
    name: 'portal.policy.edit.matchesSelection.fileType.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  }
]

export const availableActions = [
  {
    key: 'cache_control',
    name: 'portal.policy.edit.actionSelection.cache.text',
    compatibleWith: [POLICY_TYPES.REQUEST]
  },
  {
    key: 'cache_name',
    name: 'portal.policy.edit.actionSelection.cacheKeyQueryString.text',
    compatibleWith: [POLICY_TYPES.REQUEST]
  },
  {
    key: 'header',
    name: 'portal.policy.edit.actionSelection.header.text',
    compatibleWith: [POLICY_TYPES.REQUEST, POLICY_TYPES.RESPONSE, POLICY_TYPES.FINAL_REQUEST, POLICY_TYPES.FINAL_RESPONSE]
  },
  {
    key: 'tokenauth',
    name: 'portal.policy.edit.actionSelection.tokenauth.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    servicePermissions: [ MEDIA_DELIVERY_TOKEN_AUTH, VOD_STREAMING_TOKEN_AUTH ]
  },
  {
    key: 'reply',
    name: 'portal.policy.edit.actionSelection.contentTargeting.text',
    compatibleWith: [POLICY_TYPES.DEFAULT, POLICY_TYPES.REQUEST],
    servicePermissions: [ MEDIA_DELIVERY_CONTENT_TARGETTING ]
  },
  {
    key: 'negative_cache',
    name: 'portal.policy.edit.actionSelection.negativeCache.text',
    compatibleWith: [POLICY_TYPES.RESPONSE]
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.redirection.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.originHostname.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.compression.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.path.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.queryString.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.removeVary.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.allowBlock.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.postSupport.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.cors.text',
    compatibleWith: [POLICY_TYPES.REQUEST],
    notYetImplemented: true
  }
]

export const policyRuleTypeOptions = [
  { label: <FormattedMessage id="portal.configuration.policies.requestFromClient.text" />, value: POLICY_TYPES.REQUEST },
  { label: <FormattedMessage id="portal.configuration.policies.requestToOrigin.text" />, value: POLICY_TYPES.FINAL_REQUEST },
  { label: <FormattedMessage id="portal.configuration.policies.responseFromOrigin.text" />, value: POLICY_TYPES.RESPONSE },
  { label: <FormattedMessage id="portal.configuration.policies.responseToClient.text" />, value: POLICY_TYPES.FINAL_RESPONSE }
]
