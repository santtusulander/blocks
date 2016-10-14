import React from 'react'

import MatchesSelection from './matches-selection'
import ActionsSelection from './actions-selection'

import ConfigurationMatchMimeType from './matches/mime-type'
import ConfigurationMatchFileExtension from './matches/file-extension'
import ConfigurationMatchFileName from './matches/file-name'
import ConfigurationMatchIpAddress from './matches/ip-address'
import ConfigurationMatcher from './matches/matcher'

import ConfigurationActionCache from './actions/cache'
import ConfigurationActionCacheKeyQueryString from './actions/cache-key-query-string'
import ConfigurationTokenAuthentication from './actions/token-authentication'
import ConfigurationActionRedirection from './actions/redirection'
import ConfigurationActionOriginHostname from './actions/origin-hostname'
import ConfigurationActionCompression from './actions/compression'
import ConfigurationActionPath from './actions/path'
import ConfigurationActionQueryString from './actions/query-string'
import ConfigurationActionHeader from './actions/header'
import ConfigurationActionRemoveVary from './actions/remove-vary'
import ConfigurationActionAllowBlock from './actions/allow-block'
import ConfigurationActionPostSupport from './actions/post-support'
import ConfigurationActionCors from './actions/cors'

export function getActiveMatchSetForm(activeRule, matchPath, setPath, config, actions) {
  const {changeValue, formatMessage, activateSet} = actions
  const clearActiveMatchSet = () => activateSet(null)
  let activeEditForm = null
  if(matchPath) {
    const activeMatch = config.getIn(matchPath)
    const matcherProps = {
      changeValue: changeValue,
      close: clearActiveMatchSet,
      match: activeMatch,
      path: matchPath
    }
    switch(activeMatch.get('field')) {
      case 'request_header':
        activeEditForm = (
          <ConfigurationMatcher
            contains={true}
            description={formatMessage({id: 'portal.policy.edit.policies.matchHeader.text'})}
            name={formatMessage({id: 'portal.policy.edit.policies.header.text'})}
            label={formatMessage({id: 'portal.policy.edit.matcher.name.text'})}
            placeholder={formatMessage({id: 'portal.policy.edit.policies.header.placeholder'})}
            {...matcherProps}/>
        )
        break
      case 'request_path':
        activeEditForm = (
          <ConfigurationMatcher
            description={formatMessage({id: 'portal.policy.edit.policies.matchDirectory.text'})}
            name={formatMessage({id: 'portal.policy.edit.policies.directoryPath.text'})}
            label={formatMessage({id: 'portal.policy.edit.matcher.name.text'})}
            placeholder={formatMessage({id: 'portal.policy.edit.policies.directoryPath.placeholder'})}
            {...matcherProps}/>
        )
        break
      case 'request_host':
        activeEditForm = (
          <ConfigurationMatcher
            description={formatMessage({id: 'portal.policy.edit.policies.matchHostname.text'})}
            name={formatMessage({id: 'portal.policy.edit.policies.hostname.text'})}
            label={formatMessage({id: 'portal.policy.edit.matcher.name.text'})}
            placeholder={formatMessage({id: 'portal.policy.edit.policies.hostname.placeholder'})}
            {...matcherProps}/>
        )
        break
      case 'request_url':
        activeEditForm = (
          <ConfigurationMatcher
            description={formatMessage({id: 'portal.policy.edit.policies.matchURL.text'})}
            name={formatMessage({id: 'portal.policy.edit.policies.url.text'})}
            label={formatMessage({id: 'portal.policy.edit.policies.url.text'})}
            placeholder={formatMessage({id: 'portal.policy.edit.policies.url.placeholder'})}
            disableRuleSelector={true}
            {...matcherProps}/>
        )
        break
      case 'request_cookie':
        activeEditForm = (
          <ConfigurationMatcher
            contains={true}
            description={formatMessage({id: 'portal.policy.edit.policies.matchCookie.text'})}
            name={formatMessage({id: 'portal.policy.edit.policies.cookie.text'})}
            label={formatMessage({id: 'portal.policy.edit.matcher.name.text'})}
            placeholder={formatMessage({id: 'portal.policy.edit.policies.cookie.placeholder'})}
            {...matcherProps}/>
        )
        break
      case 'request_query':
        activeEditForm = (
          <ConfigurationMatcher
            contains={true}
            description={formatMessage({id: 'portal.policy.edit.policies.matchQueryString.text'})}
            name={formatMessage({id: 'portal.policy.edit.policies.queryString.text'})}
            label={formatMessage({id: 'portal.policy.edit.matcher.name.text'})}
            placeholder={formatMessage({id: 'portal.policy.edit.policies.queryString.placeholder'})}
            {...matcherProps}/>
        )
        break
      default:
        activeEditForm = (
          <MatchesSelection
            path={matchPath}
            changeValue={changeValue}/>
        )
        break
      // <ConfigurationMatchMimeType {...matcherProps}/>
      // <ConfigurationMatchFileExtension {...matcherProps}/>
      // <ConfigurationMatchFileName {...matcherProps}/>
      // <ConfigurationMatchIpAddress {...matcherProps}/>
    }
  }
  if(setPath) {
    const activeSet = config.getIn(setPath)
    const setterProps = {
      changeValue: changeValue,
      close: clearActiveMatchSet,
      path: setPath,
      set: activeSet
    }
    switch(setPath.last()) {
      case 'cache_name':
        activeEditForm = (
          <ConfigurationActionCacheKeyQueryString {...setterProps}/>
        )
        break
      case 'cache_control':
        activeEditForm = (
          <ConfigurationActionCache {...setterProps}/>
        )
        break
      case 'header':
        activeEditForm = (
          <ConfigurationActionHeader {...setterProps}/>
        )
        break
      case 'tokenauth':
        activeEditForm = (
          <ConfigurationTokenAuthentication {...setterProps}/>
        )
        break
      default:
        activeEditForm = (
          <ActionsSelection
            activateSet={activateSet}
            config={config}
            path={setPath}
            rule={activeRule}
            changeValue={changeValue}/>
        )
        break
      // <ConfigurationActionRedirection {...setterProps}/>
      // <ConfigurationActionOriginHostname {...setterProps}/>
      // <ConfigurationActionCompression {...setterProps}/>
      // <ConfigurationActionPath {...setterProps}/>
      // <ConfigurationActionQueryString {...setterProps}/>
      // <ConfigurationActionRemoveVary {...setterProps}/>
      // <ConfigurationActionAllowBlock {...setterProps}/>
      // <ConfigurationActionPostSupport {...setterProps}/>
      // <ConfigurationActionCors {...setterProps}/>
    }
  }
  return activeEditForm
}

export function secondsToUnit(value, unit) {
  value = Number(value || 0)
  switch(unit) {
    case 'minutes':
      value = value / 60
      break
    case 'hours':
      value = value / 3600
      break
    case 'days':
      value = value / 86400
      break
  }
  return value
}

export function secondsFromUnit(value, unit) {
  value = Number(value || 0)
  switch(unit) {
    case 'minutes':
      value = value * 60
      break
    case 'hours':
      value = value * 3600
      break
    case 'days':
      value = value * 86400
      break
  }
  return value
}
