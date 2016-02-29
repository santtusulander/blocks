import React from 'react'
import {Modal, Row, Col} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationDefaultPolicies from './default-policies'
import ConfigurationCacheRules from './cache-rules'
import ConfigurationCacheRuleEdit from './cache-rule-edit'
import ConfigurationSidebar from './sidebar'
import Toggle from '../toggle'

class ConfigurationCache extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeRulePath: null,
      rightColVisible: true
    }

    this.addRule = this.addRule.bind(this)
    this.clearActiveRule = this.clearActiveRule.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleRightColClose = this.handleRightColClose.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.changeActiveRuleType = this.changeActiveRuleType.bind(this)
  }
  addRule(e) {
    e.preventDefault()
    this.setState({activeRulePath: []})
  }
  clearActiveRule() {
    this.setState({activeRulePath: null})
  }
  handleChange(path) {
    return value => this.props.changeValue(path, value)
  }
  handleRightColClose() {
    this.setState({
      rightColVisible: false
    })
  }
  handleSave(e) {
    e.preventDefault()
    this.props.saveChanges()
  }
  changeActiveRuleType(type) {
    let rulePath = this.state.activeRulePath;
    if(type === 'request') {
      rulePath[0] = 'request_policies'
    }
    else if(type === 'response') {
      rulePath[0] = 'response_policies'
    }
    this.setState({activeRulePath: rulePath})
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
    let modalRightColContent = (
      <div>
        <Modal.Header>
          <h1>Choose Condition</h1>
          <p>Select the condition type. You can have multiple conditions of the same type in a policy.</p>
        </Modal.Header>
        <Modal.Body>
          <p>Select the condition type. You can have multiple conditions of the same type in a policy.</p>
        </Modal.Body>
      </div>
    )
    return (
      <form className="configuration-cache" onSubmit={this.handleSave}>

        {/* Origin Cache Control */}

        <h2>Origin Cache Control</h2>


        { /* Honor Origin Cache Control */}
        <Row>
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
        <Row>
          <Col lg={4} xs={6} className="toggle-label">
            Ignore case from origin
          </Col>
          <Col lg={8} xs={6}>
            <Toggle value={config.getIn(policyPaths.ignore_case)}
              changeValue={this.handleChange(policyPaths.ignore_case)}/>
          </Col>
        </Row>

        { /* Enable e-Tag support */}
        <Row>
          <Col lg={4} xs={6} className="toggle-label">
            Enable e-Tag support
          </Col>
          <Col lg={8} xs={6}>
            <Toggle value={config.getIn(policyPaths.honor_etags)}
              changeValue={this.handleChange(policyPaths.honor_etags)}/>
          </Col>
        </Row>

        <hr/>

        <h3>Edge Cache Control</h3>
        <ConfigurationDefaultPolicies/>

        <Row>
          <Col sm={8}>
            <h3>CDN Cache Rules</h3>
          </Col>
          <Col sm={4} className="text-right">
            <a href="#" className="add-rule" onClick={this.addRule}>
              Add Cache Rule
            </a>
          </Col>
        </Row>
        <ConfigurationCacheRules
          requestPolicies={config.get('request_policies')}
          responsePolicies={config.get('response_policies')}/>
        {this.state.activeRulePath ?
          <ConfigurationSidebar rightColVisible={this.state.rightColVisible}
            rightColContent={modalRightColContent}
            handleRightColClose={this.handleRightColClose}
            onHide={this.clearActiveRule}>
            <ConfigurationCacheRuleEdit
              rule={config.getIn(this.state.activeRulePath)}
              rulePath={this.state.activeRulePath}
              changeActiveRuleType={this.changeActiveRuleType}
              hideAction={this.clearActiveRule}/>
          </ConfigurationSidebar>
        : ''}
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
