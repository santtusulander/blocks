import React from 'react'
import {Input, Row, Col} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationDefaultPolicies from './default-policies'
import ConfigurationCacheRules from './cache-rules'
import Toggle from '../toggle'

class ConfigurationCache extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  handleChange(path) {
    return value => this.props.changeValue(path, value)
  }
  handleSave(e) {
    e.preventDefault()
    this.props.saveChanges()
  }
  render() {
    let config = this.props.config;
    if(!config || !config.size) {
      return (
        <div className="container">Loading...</div>
      )
    }
    let policyPath = Immutable.List([
      'default_policies']);
    let policyPaths = {
      honor_origin_cache_policies: policyPath
        .push(
          config.getIn(policyPath)
            .findIndex(policy => policy.get('set').has('cache_control')),
            'honor_origin'),
      honor_etags: policyPath
        .push(
          config.getIn(policyPath)
            .findIndex(policy => policy.get('set').has('cache_control')),
            'check_etag'),
      ignore_case: policyPath
        .push(
          config.getIn(policyPath)
            .findIndex(policy => policy.get('set').has('cache_name')),
            'ignore_case')
    };
    return (
      <form className="configuration-cache" onSubmit={this.handleSave}>

        {/* Origin Cache Control */}

        <h2>Origin Cache Control</h2>


        { /* Honor Origin Cache Control */}
        <Row>
          <Col xs={4}>
            Honor Origin Cache Control
          </Col>
          <Col xs={8}>
            <Toggle
              value={config.getIn(policyPaths.honor_origin_cache_policies)}
              changeValue={this.handleChange(policyPaths.honor_origin_cache_policies)}/>
          </Col>
        </Row>

        { /* Ignore case from origin */}
        <Row>
          <Col xs={4}>
            Ignore case from origin
          </Col>
          <Col xs={8}>
            <Toggle value={config.getIn(policyPaths.ignore_case)}
              changeValue={this.handleChange(policyPaths.ignore_case)}/>
          </Col>
        </Row>

        { /* Enable e-Tag support */}
        <Row>
          <Col xs={4}>
            Enable e-Tag support
          </Col>
          <Col xs={8}>
            <Toggle value={config.getIn(policyPaths.honor_etags)}
              changeValue={this.handleChange(policyPaths.honor_etags)}/>
          </Col>
        </Row>

        <hr/>

        <h3>Edge Cache Control</h3>
        <Row>
          <Col xs={8}>
            <ConfigurationDefaultPolicies/>
          </Col>
        </Row>

        <h3>CDN Cache Rules</h3>
        <ConfigurationCacheRules
          requestPolicies={config.get('request_policies')}
          responsePolicies={config.get('response_policies')}/>
      </form>
    )
  }
}

ConfigurationCache.displayName = 'ConfigurationCache'
ConfigurationCache.propTypes = {
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  saveChanges: React.PropTypes.func
}

module.exports = ConfigurationCache
