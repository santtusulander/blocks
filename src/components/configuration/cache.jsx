import React from 'react'
import {Input, Row, Col} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationDefaultPolicies from './default-policies'
import ConfigurationCacheRules from './cache-rules'

class ConfigurationCache extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  handleChange(path) {
    return e => this.props.changeValue(path, e.target.checked)
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

        <Row>
          <Col xs={12}>

            { /* Honor Origin Cache Control */}

            <Input type="checkbox" label="Honor Origin Cache Control"
              checked={config.getIn(policyPaths.honor_origin_cache_policies)}
              onChange={this.handleChange(policyPaths.honor_origin_cache_policies)}/>

            { /* Ignore case from origin */}

            <Input type="checkbox" label="Ignore case from origin"
              checked={config.getIn(policyPaths.ignore_case)}
              onChange={this.handleChange(policyPaths.ignore_case)}/>

            { /* Enable e-Tag support */}

            <Input type="checkbox" label="Enable e-Tag support"
              checked={config.getIn(policyPaths.honor_etags)}
              onChange={this.handleChange(policyPaths.honor_etags)}/>

          </Col>
        </Row>

        <hr/>

        <h3>Edge Cache Control</h3>

        <Row>
          <Col xs={8}>
            <ConfigurationDefaultPolicies/>
          </Col>
        </Row>


        {/* CDN Cache Rules */}

        <h3>CDN Cache Rules</h3>
        <ConfigurationCacheRules/>
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
