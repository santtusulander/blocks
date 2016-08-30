import React from 'react'
import {Row, Col, Input} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationDefaultPolicies from './default-policies'
import Toggle from '../toggle'
import Select from '../select'

import {FormattedMessage, injectIntl} from 'react-intl'

function secondsToUnit(value, unit) {
  value = parseInt(value || 0)
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
function secondsFromUnit(value, unit) {
  value = parseInt(value || 0)
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

class ConfigurationDefaults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ttlUnit: 'seconds'
    }

    this.changeTTLUnit = this.changeTTLUnit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEtagChange = this.handleEtagChange.bind(this)
  }
  handleChange(path) {
    return value => {
      if(value.target) {
        value = value.target.value
      }
      this.props.changeValue(path, value)
    }
  }
  handleEtagChange(path) {
    return value => {
      this.props.changeValue(path, value)
    }
  }
  changeTTLUnit(path) {
    return unit => {
      let value = this.props.config.getIn(path)
      value = secondsToUnit(value, this.state.ttlUnit)
      value = secondsFromUnit(value, unit)
      this.props.changeValue(path, value)
      this.setState({ttlUnit: unit})
    }
  }
  changeTTLValue(path) {
    return e => {
      const value = secondsFromUnit(e.target.value, this.state.ttlUnit)
      this.props.changeValue(path, value)
    }
  }
  render() {
    let config = this.props.config;
    if(!config || !config.size) {
      return (
        <div className="container"><FormattedMessage id="portal.loading.text"/></div>
      )
    }
    const policyPath = Immutable.List([
      'default_policy', 'policy_rules'])
    let controlIndex = config.getIn(policyPath)
      .findIndex(policy => {
        if(policy.has('set')) {
          return policy.get('set').has('cache_control')
        }
      })
    let nameIndex = config.getIn(policyPath)
      .findIndex(policy => {
        if(policy.has('set')) {
          return policy.get('set').has('cache_name')
        }
      })
    const policyPaths = {
      honor_origin_cache_policies: policyPath.push(controlIndex,'set','cache_control','honor_origin'),
      honor_etags: policyPath.push(controlIndex,'set','cache_control','check_etag'),
      max_age: policyPath.push(controlIndex,'set','cache_control','max_age'),
      ignore_case: policyPath.push(nameIndex,'set','cache_name','ignore_case')
    };

    let ttlValue = secondsToUnit(
      this.props.config.getIn(policyPaths.max_age),
      this.state.ttlUnit
    )
    return (
      <div className="configuration-defaults">

        {/* Origin Cache Control */}

        <h2><FormattedMessage id="portal.policy.edit.defaults.originCacheControl.text"/></h2>

        {/* Ignore case from origin */}
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.ignoreOriginCase.text"/>
          </Col>
          <Col lg={8} xs={6}>
            <Toggle value={config.getIn(policyPaths.ignore_case)}
              changeValue={this.handleChange(policyPaths.ignore_case)}/>
          </Col>
        </Row>

        {/* Enable e-Tag support */}
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.enableEtag.text"/>
          </Col>
          <Col lg={5} xs={6}>
            <Select className="input-select"
              onSelect={this.handleEtagChange(policyPaths.honor_etags)}
              value={config.getIn(policyPaths.honor_etags)}
              options={[
                ['strong', <FormattedMessage id="portal.policy.edit.defaults.enableEtagStrong.text"/>],
                ['weak', <FormattedMessage id="portal.policy.edit.defaults.enableEtagWeak.text"/>],
                ['false', <FormattedMessage id="portal.policy.edit.defaults.enableEtagFalse.text"/>]]}/>
          </Col>
        </Row>

        {/* Honor Origin Cache Control */}
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.honorOriginCacheControl.text"/>
          </Col>
          <Col lg={8} xs={6}>
            <Toggle
              value={config.getIn(policyPaths.honor_origin_cache_policies)}
              changeValue={this.handleChange(policyPaths.honor_origin_cache_policies)}/>
          </Col>
        </Row>

        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            {config.getIn(policyPaths.honor_origin_cache_policies) ?
              <FormattedMessage id="portal.policy.edit.defaults.ttlIfNotPresent.text"/> :
              'CDN TTL'}
          </Col>
          <Col lg={2} xs={3}>
            <Input type="text" placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.defaults.timeToLive.text'})}
              value={ttlValue}
              onChange={this.changeTTLValue(policyPaths.max_age)}/>
          </Col>
          <Col xs={3}>
            <Select className="input-select"
              onSelect={this.changeTTLUnit(policyPaths.max_age)}
              value={this.state.ttlUnit}
              options={[
                ['seconds', <FormattedMessage id="portal.units.seconds"/>],
                ['minutes', <FormattedMessage id="portal.units.minutes"/>],
                ['hours', <FormattedMessage id="portal.units.hours"/>],
                ['days', <FormattedMessage id="portal.units.days"/>]]}/>
          </Col>
        </Row>

        <hr/>

        <h3><FormattedMessage id="portal.policy.edit.defaults.cacheKeyQueryString.text"/></h3>
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.cacheKey.text"/>
          </Col>
          <Col lg={5} xs={6}>
            <Select className="input-select"
              options={[
                ['include_all_query_parameters', <FormattedMessage id="portal.policy.edit.defaults.includeAllQueryTerms.text"/>],
                ['ignore_all_query_parameters', <FormattedMessage id="portal.policy.edit.defaults.ignoreAllQueryTerms.text"/>],
                ['include_some_parameters', <FormattedMessage id="portal.policy.edit.defaults.includeAllQueryTerms.text"/>],
                ['ignore_some_parameters', <FormattedMessage id="portal.policy.edit.defaults.ignoreSomeParams.text"/>]]}/>
          </Col>
        </Row>
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.queryName.text"/>
          </Col>
          <Col lg={5} xs={6}>
            <Input type="text" placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.defaults.queryName.placeholder'})}/>
          </Col>
        </Row>

        <hr/>

        <h3><FormattedMessage id="portal.policy.edit.defaults.edgeCacheDefaultRules.text"/></h3>
        <ConfigurationDefaultPolicies/>
      </div>
    )
  }
}

ConfigurationDefaults.displayName = 'ConfigurationDefaults'
ConfigurationDefaults.propTypes = {
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  intl: React.PropTypes.object
}
ConfigurationDefaults.defaultProps = {
  config: Immutable.Map()
}

module.exports = injectIntl(ConfigurationDefaults)
