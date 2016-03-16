import React from 'react'
import {Row, Col, Input} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationDefaultPolicies from './default-policies'
import Toggle from '../toggle'
import Select from '../select'

function secondsToUnit(value, unit) {
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
  }
  handleChange(path) {
    return value => {
      if(value.target) {
        value = value.target.value
      }
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
        <div className="container">Loading...</div>
      )
    }
    const policyPath = Immutable.List([
      'default_policy', 'policy_rules'])
    let controlIndex = config.getIn(policyPath)
      .findIndex(policy => {
        if(policy.has('set')) {
          policy.get('set').has('cache_control')
        }
      })
    let nameIndex = config.getIn(policyPath)
      .findIndex(policy => {
        if(policy.has('set')) {
          return policy.get('set').has('cache_name')
        }
      })
    const policyPaths = {
      honor_origin_cache_policies: policyPath.push(controlIndex, 'honor_origin'),
      honor_etags: policyPath.push(controlIndex, 'check_etag'),
      max_age: policyPath.push(controlIndex, 'max_age'),
      ignore_case: policyPath.push(nameIndex, 'ignore_case')
    };

    let ttlValue = secondsToUnit(
      this.props.config.getIn(policyPaths.max_age),
      this.state.ttlUnit
    )
    return (
      <div className="configuration-defaults">

        {/* Origin Cache Control */}

        <h2>Origin Cache Control</h2>

        { /* Ignore case from origin */}
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            Ignore case from origin
          </Col>
          <Col lg={8} xs={6}>
            <Toggle value={config.getIn(policyPaths.ignore_case)}
              changeValue={this.handleChange(policyPaths.ignore_case)}/>
          </Col>
        </Row>

        { /* Enable e-Tag support */}
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            Enable e-Tag support
          </Col>
          <Col lg={8} xs={6}>
            <Toggle value={config.getIn(policyPaths.honor_etags)}
              changeValue={this.handleChange(policyPaths.honor_etags)}/>
          </Col>
        </Row>

        { /* Honor Origin Cache Control */}
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            Honor Origin Cache Control
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
              'TTL if not present' :
              'CDN TTL'}
          </Col>
          <Col lg={2} xs={3}>
            <Input type="text" placeholder="Time to live"
              value={ttlValue}
              onChange={this.changeTTLValue(policyPaths.max_age)}/>
          </Col>
          <Col xs={3}>
            <Select className="input-select"
              onSelect={this.changeTTLUnit(policyPaths.max_age)}
              value={this.state.ttlUnit}
              options={[
                ['seconds', 'Seconds'],
                ['minutes', 'Minutes'],
                ['hours', 'Hours'],
                ['days', 'Days']]}/>
          </Col>
        </Row>

        <hr/>

        <h3>Cache Key - Query String</h3>
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            Cache Key
          </Col>
          <Col lg={5} xs={6}>
            <Select className="input-select"
              options={[
                ['include_all_query_parameters', 'Include all query parameters'],
                ['ignore_all_query_parameters', 'Ignore all query parameters'],
                ['include_some_parameters', 'Include some parameters'],
                ['ignore_some_parameters', 'Ignore some parameters']]}/>
          </Col>
        </Row>
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            Query Name
          </Col>
          <Col lg={5} xs={6}>
            <Input type="text" placeholder="Enter Query Name"/>
          </Col>
        </Row>

        <hr/>

        <h3>Edge Cache Default Rules</h3>
        <ConfigurationDefaultPolicies/>
      </div>
    )
  }
}

ConfigurationDefaults.displayName = 'ConfigurationDefaults'
ConfigurationDefaults.propTypes = {
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = ConfigurationDefaults
