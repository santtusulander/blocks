import Immutable from 'immutable'

export const DEFAULT_MATCH_JS = {match: {field: null, cases: [['',[]]]}}
export const DEFAULT_MATCH = Immutable.fromJS(DEFAULT_MATCH_JS)

export const POLICY_TYPES = {
  REQUEST: 'request_policy',
  RESPONSE: 'response_policy',
  DEFAULT: 'default_policy'
}

export const availableMatches = [
  {
    key: 'request_host',
    name: 'portal.policy.edit.matchesSelection.hostname.text',
    compatibleWith: ['request_policy']
  },
  {
    key: 'request_url',
    name: 'portal.policy.edit.matchesSelection.url.text',
    compatibleWith: ['request_policy']
  },
  {
    key: 'request_path',
    name: 'portal.policy.edit.matchesSelection.directoryPath.text',
    compatibleWith: ['request_policy']
  },
  {
    key: 'request_query_arg',
    name: 'portal.policy.edit.matchesSelection.queryString.text',
    compatibleWith: ['request_policy']
  },
  {
    key: 'request_header',
    name: 'portal.policy.edit.matchesSelection.header.text',
    compatibleWith: ['request_policy', 'response_policy']
  },
  {
    key: 'request_cookie',
    name: 'portal.policy.edit.matchesSelection.cookie.text',
    compatibleWith: ['request_policy', 'response_policy']
  },
  {
    key: 'content_targeting',
    name: 'portal.policy.edit.matchesSelection.contentTargeting.text',
    compatibleWith: ['request_policy'],
    requiresAdmin: true
  },
  { // File Extension (not yet implemented on backend)
    key: null,
    name: 'portal.policy.edit.matchesSelection.fileExtension.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  { // File Name (not yet implemented on backend)
    key: 'File Name',
    name: 'portal.policy.edit.matchesSelection.fileName.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  { // File Type (not yet implemented on backend)
    key: 'File Type',
    name: 'portal.policy.edit.matchesSelection.fileType.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  }
]

export const availableActions = [
  {
    key: 'cache_control',
    name: 'portal.policy.edit.actionSelection.cache.text',
    compatibleWith: ['request_policy']
  },
  {
    key: 'cache_name',
    name: 'portal.policy.edit.actionSelection.cacheKeyQueryString.text',
    compatibleWith: ['request_policy']
  },
  {
    key: 'header',
    name: 'portal.policy.edit.actionSelection.header.text',
    compatibleWith: ['request_policy', 'response_policy']
  },
  {
    key: 'tokenauth',
    name: 'portal.policy.edit.actionSelection.tokenauth.text',
    compatibleWith: ['request_policy'],
    requiresAdmin: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.redirection.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.originHostname.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.compression.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.path.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.queryString.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.removeVary.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.allowBlock.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.postSupport.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  },
  {
    key: null,
    name: 'portal.policy.edit.actionSelection.cors.text',
    compatibleWith: ['request_policy'],
    notYetImplemented: true
  }
]
