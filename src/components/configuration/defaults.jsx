import React from 'react'
import {Modal, Row, Col} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationDefaultPolicies from './default-policies'
import ConfigurationPolicyRuleEdit from './policy-rule-edit'
import ConfigurationSidebar from './sidebar'
import Toggle from '../toggle'

class ConfigurationDefaults extends React.Component {
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
    const policyPath = Immutable.List([
      'default_policies']);
    let controlIndex = config.getIn(policyPath)
      .findIndex(policy => policy.get('set').has('cache_control'))
    let nameIndex = config.getIn(policyPath)
      .findIndex(policy => policy.get('set').has('cache_name'))
    const policyPaths = {
      honor_origin_cache_policies: policyPath.push(controlIndex, 'honor_origin'),
      honor_etags: policyPath.push(controlIndex, 'check_etag'),
      ignore_case: policyPath.push(nameIndex, 'ignore_case')
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
      <form className="configuration-defaults" onSubmit={this.handleSave}>

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

        {this.state.activeRulePath ?
          <ConfigurationSidebar rightColVisible={this.state.rightColVisible}
            rightColContent={modalRightColContent}
            handleRightColClose={this.handleRightColClose}
            onHide={this.clearActiveRule}>
            <ConfigurationPolicyRuleEdit
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

ConfigurationDefaults.displayName = 'ConfigurationDefaults'
ConfigurationDefaults.propTypes = {
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  saveChanges: React.PropTypes.func
}

module.exports = ConfigurationDefaults
