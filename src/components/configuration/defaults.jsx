import React from 'react'
import {Row, Col} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationDefaultPolicies from './default-policies'
import Toggle from '../toggle'

class ConfigurationDefaults extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(path) {
    return value => this.props.changeValue(path, value)
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
      ignore_case: policyPath.push(nameIndex, 'ignore_case')
    };
    return (
      <form className="configuration-defaults">

        {/* Origin Cache Control */}

        <h2>Origin Cache Control</h2>


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

        <hr/>

        <h3>Edge Cache Default Rules</h3>
        <ConfigurationDefaultPolicies/>
      </form>
    )
  }
}

ConfigurationDefaults.displayName = 'ConfigurationDefaults'
ConfigurationDefaults.propTypes = {
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = ConfigurationDefaults
