import React from 'react'
import { FormattedMessage } from 'react-intl'
import { fromJS } from 'immutable'
import _ from 'underscore'

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
            name: setContentTargetingActionName(action), // TODO: localize this
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

  return _.flatten(countries.filter( c => {
    return c.response && c.response.code && ( responseCodes.includes( c.response.code ) )
  }).map( c => {
    const cArray = c.in || c.not_in
    return (cArray)
  }))
}

/*
 * Constructs a localized string looking like: (Deny/Allow) Users (from/NOT from) FI
 * or in case of redirection: Redirect Users (from/NOT from) US: www.redirect.here
 */
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
