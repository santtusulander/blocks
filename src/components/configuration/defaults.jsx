import React from 'react'
import {Row, Col, Input} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationDefaultPolicies from './default-policies'
import Toggle from '../toggle'
import Select from '../select'

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
      <div className="configuration-defaults">

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
