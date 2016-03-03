import React from 'react'
import {Modal, Row, Col, Button} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationPolicyRules from './policy-rules'
import ConfigurationPolicyRuleEdit from './policy-rule-edit'
import IconAdd from '../icons/icon-add.jsx'
import ConfigurationSidebar from './sidebar'

class ConfigurationPolicies extends React.Component {
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
    this.activateRule = this.activateRule.bind(this)
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
  activateRule(path) {
    this.setState({activeRulePath: path})
  }
  render() {
    let config = this.props.config;
    if(!config || !config.size) {
      return (
        <div className="container">Loading...</div>
      )
    }
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
      <div className="configuration-policies">

        <Row className="header-btn-row">
          <Col sm={8}>
            <h3>Policy Rules</h3>
          </Col>
          <Col sm={4} className="text-right">
            <Button bsStyle="primary" className="btn-icon btn-add-new"
              onClick={this.addRule}>
              <IconAdd />
            </Button>
          </Col>
        </Row>
        <ConfigurationPolicyRules
          requestPolicies={config.get('request_policies')}
          responsePolicies={config.get('response_policies')}
          activateRule={this.activateRule}/>
        {this.state.activeRulePath ?
          <ConfigurationSidebar rightColVisible={this.state.rightColVisible}
            rightColContent={modalRightColContent}
            handleRightColClose={this.handleRightColClose}
            onHide={this.clearActiveRule}>
            <ConfigurationPolicyRuleEdit
              changeValue={this.props.changeValue}
              rule={config.getIn(this.state.activeRulePath)}
              rulePath={this.state.activeRulePath}
              changeActiveRuleType={this.changeActiveRuleType}
              hideAction={this.clearActiveRule}/>
          </ConfigurationSidebar>
        : ''}
      </div>
    )
  }
}

ConfigurationPolicies.displayName = 'ConfigurationPolicies'
ConfigurationPolicies.propTypes = {
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  saveChanges: React.PropTypes.func
}

module.exports = ConfigurationPolicies
