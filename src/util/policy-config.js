import Immutable, { fromJS } from 'immutable'

import { flatten } from '../util/helpers'
import {
  POLICY_TYPES
} from '../constants/property-config'

import { TOKEN_AUTH_STREAMING } from '../constants/configuration'

export const ALLOW_RESPONSE_CODES = [200]
export const DENY_RESPONSE_CODES = [401,404,500]
export const REDIRECT_RESPONSE_CODES = [301,302]

export const WILDCARD_REGEXP = '.*';

// NOTE: OK, so this RegExp is pretty nuts.
// Basically, what it does is allow us to grab a list of file extensions from a
// different RegExp string returned by the server.
// An example input string: (.*)\\.(aif|aiff)
// We need to get the aif|aiff part of that string.
export const FILE_EXTENSION_REGEXP = /\(\.\*\)(?:\\)?\\\.\((.*)\)/
export const FILE_EXTENSION_CASE_START = '(.*)\\\\.('
export const FILE_EXTENSION_CASE_END = ')'
export const FILE_EXTENSION_DEFAULT_CASE = FILE_EXTENSION_CASE_START + FILE_EXTENSION_CASE_END

//"equals | substr | exists | empty | in | regexp"
export function getMatchFilterType(item) {
  if(item.get('type') === 'exists') {
    return item.get('inverted') ? 'does_not_exist' : 'exists'
  }

  if(item.get('type') === 'in') {
    return item.get('inverted') ? 'does_not_contain' : 'contains'
  }

  if(item.get('type') === 'equals') {
    return item.get('inverted') ? 'does_not_equals' : 'equals'
  }

  if(item.get('type') === 'empty') {
    return item.get('inverted') ? 'does_not_empty' : 'empty'
  }

  throw new Error('Unexpected condition type')
}

export function policyContainsMatchField(policy, field, count) {
  const matches = fromJS(policy.matches)
  return matches.filter(match => match.get('field') === field).count() === count
}

export function policyContainsSetComponent(policy, setComponent) {
  const sets = fromJS(policy.sets)
  return sets.filter(set => set.get('setkey') === setComponent).count() > 0
}

export function matchIsFileExtension(match) {
  return !!((match.get('field') === 'request_url' || match.get('field') === 'request_path')
          && FILE_EXTENSION_REGEXP.test(match.get('value')))
}

export function actionIsTokenAuth(sets) {
  return sets.some( set => (set.setkey === 'tokenauth') )
}

const parseConditions = (items, path) => {
  return items ? items.map((item, i) => ({
    field: item.get('field'),
    fieldDetail: item.get('field_detail'),
    filterType: getMatchFilterType(item),
    values: Array.isArray(item.get('value')) ? item.get('value') : [item.get('value')],
    path: path.concat([i])
  })).toJS() : []
}

const parseActions = (items, path) => {
  return items ? items.map((item, i) => {
    const actionName = item.keySeq().toArray()[0]

    return {
      setkey: actionName,
      name: actionName,
      path: path.concat([i]),
      _temp: item.get('_temp')
    }
  }).toJS() : []
}

export function parsePolicy(rule, path) {
  const conditions = rule ? rule.get('rule_body').get('conditions') : Immutable.List()
  const actions = rule ? rule.get('rule_body').get('actions') : Immutable.List()

  return  {
    matches: parseConditions(conditions, path.concat(['rule_body', 'conditions'])),
    sets: parseActions(actions, path.concat(['rule_body', 'actions']))
  }
}

/**
 * Get script_lua block from policy rule
 * @param policy
 * @returns {*}
 */
export const getScriptLua = ( policy ) => {
  return policy.getIn(['match', 'cases', 0, 1, 0, 'script_lua']).toJS()
}

/**
 * Parse countries that have response code specified in responseCodes
 * @param scriptLua, responseCodes
 * @returns {*|Array}
 */
export const parseCountriesByResponseCodes = ( scriptLua, responseCodes ) => {
  const countries = scriptLua.target.geo[0].country

  return flatten(countries.filter( c => {
    return c.response && c.response.code && ( responseCodes.includes( c.response.code ) )
  }).map( c => {
    const cArray = c.in || c.not_in
    return (cArray)
  }))
}

/**
 * Gets Vary Header Rule from config
 * @param config
 * @returns Boolean
 */
export const getVaryHeaderRuleId = ( config ) => {
  const path = config.getIn([POLICY_TYPES.RESPONSE, 'policy_rules'])

  return path.findIndex( rule => {
    return 'Vary' === rule.getIn(['set', 'header','header'])
  })
}

/**
 * Get Active configuration from a property
 * @param  {Object} property
 * @return {Object} Active Configuration object
 */
export const getActiveConfiguration = (property) => {
  try {
    const activeConfigId = property.services[0].active_configurations[0].config_id
    return property.services[0].configurations.find( config => activeConfigId === config.config_id)
  } catch (e){
    return null
  }
}

/**
 * Extract token Authentication rules from list of properties
 * @param  {} properties object from redux (list)
 * @return [Array] of token auth rules
 */
export const getTokenAuthRules = (properties) => {
  let tokenAuthRules = []
  for( let key in properties) {
    const property = properties[key]
    const config = getActiveConfiguration(property)

    config && config.request_policy.policy_rules.forEach( (rule, key) => {
      const {sets} = parsePolicy(fromJS(rule), [])
      if ( actionIsTokenAuth( sets ) ) {
        const tokenAuthConfig = fromJS(rule).getIn(sets[0].path).toJS()
        const returnObj = {
          ruleId: key,
          propertyName: property.published_host_id,
          type: tokenAuthConfig.type === TOKEN_AUTH_STREAMING ? 'portal.security.tokenAuth.streaming.text' :'portal.security.tokenAuth.static.text',
          accountId: property.accountId,
          groupId: property.groupId,
          encryption: tokenAuthConfig.encryption,
          streaming_encryption: tokenAuthConfig.streaming_encryption,
          schema: tokenAuthConfig.schema,
          created: config.config_created
        }
        tokenAuthRules.push(returnObj)
      }
    })
  }

  return tokenAuthRules
}

/**
 * Checks whether or not the rule at the given path is empty
 * @param config a property configuration object
 * @param rulePath the path to the rule in the configuration object (ex ['request_policy', 'policy_rule', 0])
 * @return returns true if the rule at the given path is empty
 */
export const isPolicyRuleEmpty = (config, rulePath) => {
  return !!config.getIn(rulePath).get('rule_body').get('actions').size
}
