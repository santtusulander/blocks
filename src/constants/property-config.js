import Immutable from 'immutable'

export const DEFAULT_MATCH_JS = {match: {field: null, cases: [['',[]]]}}
export const DEFAULT_MATCH = Immutable.fromJS(DEFAULT_MATCH_JS)

export const POLICY_TYPES = {
  REQUEST: 'request_policy',
  RESPONSE: 'response_policy',
  DEFAULT: 'default_policy'
}
