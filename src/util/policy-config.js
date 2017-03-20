import React from 'react'
import { FormattedMessage } from 'react-intl'
import Immutable, { fromJS } from 'immutable'

import { flatten } from '../util/helpers'
import {
  POLICY_TYPES,
  DEFAULT_MATCH
} from '../constants/property-config'

import { TOKEN_AUTH_STREAMING } from '../constants/configuration'

export const matchFilterChildPaths = {
  'exists': ['cases', 0, 1],
  'contains': ['cases', 0, 1],
  'does_not_exist': ['default'],
  'does_not_contain': ['cases', 1, 1]
}

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

export function getMatchFilterType(match) {
  if(!match.get('field_detail')) {
    return match.get('default') ? 'does_not_exist' : 'exists'
  }
  if(match.get('default')) {
    return 'does_not_exist'
  }
  if(match.get('cases').size > 1) {
    return 'does_not_contain'
  }
  return match.getIn(['cases', 0, 0]) === '.*' ? 'exists' : 'contains'
}

export function policyContainsMatchField(policy, field, count) {
  const matches = fromJS(policy.matches)
  return matches.filter(match => match.get('field') === field).count() === count
}

export function policyIsCompatibleWithMatch(policy, match) {
  switch (match) {
    case 'content_targeting':
      return policy.matches.length === 1
              && policy.sets.length === 0
  }
  return true
}

export function policyIsCompatibleWithAction(policy, action) {
  switch (action) {
    case 'tokenauth':
      return policy.matches.length === 1
              && policy.sets.length === 1
              && policyContainsMatchField(policy, 'request_url', 1)
    case 'content_targeting':
      return policy.matches.length === 1
              && policy.sets.length >= 1
              && policy.sets[0].path.indexOf('script_lua') !== -1
  }
  return true
}

export function policyContainsSetComponent(policy, setComponent) {
  const sets = fromJS(policy.sets)
  return sets.filter(set => set.get('setkey') === setComponent).count() > 0
}

export function matchIsContentTargeting(match) {
  return !!(match.get('field') === 'request_host'
          && match.getIn(["cases", 0, 1, 0, "script_lua"]))
}

export function matchIsFileExtension(match) {
  return !!((match.get('field') === 'request_url' || match.get('field') === 'request_path')
          && FILE_EXTENSION_REGEXP.test(match.getIn(["cases", 0, 0])))
}

export function actionIsTokenAuth(sets) {
  return sets.some( set => (set.setkey === 'tokenauth') )
}

export function parsePolicy(policy, path) {
  // if this is a match
  if(policy && policy.has('match')) {
    const match = policy.get('match')
    const fieldDetail = match.get('field_detail')
    const caseKey = match.getIn(['cases', 0, 0])
    const filterType = getMatchFilterType(match)
    const childPath = matchFilterChildPaths[filterType]
    let {matches, sets} = match.getIn(childPath).reduce((combinations, subcase, i) => {
      // build up a path to the nested rules
      const nextPath = path.concat(['match'], childPath, [i])
      // recurse to parse the nested policy rules
      const {matches, sets} = parsePolicy(subcase, nextPath)
      // add any found matches / sets to the list
      combinations.matches = combinations.matches.concat(matches)
      combinations.sets = combinations.sets.concat(sets)
      return combinations
    }, {matches: [], sets: []})
    // add info about this match to the list of matches
    matches.push({
      containsVal: fieldDetail ? caseKey : '',
      field: match.get('field'),
      fieldDetail: fieldDetail,
      filterType: match.get('field') ? filterType : '',
      values: match.get('cases').map(matchCase => matchCase.get(0)).toJS(),
      path: path.concat(['match'])
    })
    return {
      matches: matches,
      sets: sets
    }
  }
  // if this is a set
  else if(policy && policy.has('set')) {
    // sets are the deepest level, so just return data about the sets
    return {
      matches: [],
      sets: policy.get('set').keySeq().toArray().map((key) => {
        return {
          setkey: key,
          name: key,
          path: path.concat(['set', key])
        }
      })
    }
  }
  // if this is a content targeting "action"
  else if (policy && policy.has('script_lua')) {
    // we will search for actions in the following paths
    // this is forward-thinking for when we eventually add city/state support
    const searchPaths = [
      // ['script_lua', 'target', 'geo', 0, 'city'],
      // ['script_lua', 'target', 'geo', 0, 'state'],
      ['script_lua', 'target', 'geo', 0, 'country']
    ]

    let sets = []

    for (let searchPath of searchPaths) {
      if (policy.getIn(searchPath)) {
        const actions = policy.getIn(searchPath).toJS().map((action, index) => {
          return {
            setkey: index,
            name: setContentTargetingActionName(action),
            path: path.concat(searchPath).concat([index])
          }
        })
        sets = sets.concat(actions)
      }
    }

    return {
      matches: [],
      sets
    }
  }
  else {
    return {
      matches: [],
      sets: []
    }
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
 * Constructs a localized string looking like: (Deny/Allow) Users (from/NOT from) FI
 * or in case of redirection: Redirect Users (from/NOT from) US: www.redirect.here
 */
// eslint-disable-next-line react/display-name
const setContentTargetingActionName = action => {
  const { response: { headers, code } } = action
  const countries = action.not_in ? action.not_in.join(', ') : action.in.join(', ')
  const fromOrNotFromPart = action.not_in ?
    'portal.policy.edit.policies.contentTargeting.notFrom.text' :
    'portal.policy.edit.policies.contentTargeting.from.text'
  const redirectTo = headers && headers.Location
  const redirLocationPart = redirectTo ? (': ' + redirectTo) : ''
  let actionTypePart = null
  if (code < 300) {
    actionTypePart = 'portal.policy.edit.allowBlock.allow.text'
  } else if(code < 400) {
    actionTypePart = 'portal.policy.edit.allowBlock.redirect.text'
  } else {
    actionTypePart = 'portal.policy.edit.allowBlock.deny.text'
  }
  return (
    <span>
      <FormattedMessage id={actionTypePart}/> <FormattedMessage id={fromOrNotFromPart}/> {countries}
      {redirLocationPart}
    </span>
  )
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
  return Immutable.is(config.getIn(rulePath).get('match'), DEFAULT_MATCH.get('match'))
}
