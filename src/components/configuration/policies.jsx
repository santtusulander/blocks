import React from 'react'
import {Modal, Row, Col, Button} from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationPolicyRules from './policy-rules'
import ConfigurationPolicyRuleEdit from './policy-rule-edit'
import IconAdd from '../icons/icon-add.jsx'

class ConfigurationPolicies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {activeRulePath: null}

    this.addRule = this.addRule.bind(this)
    this.clearActiveRule = this.clearActiveRule.bind(this)
    this.handleChange = this.handleChange.bind(this)
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
    return (
      <div className="configuration-policies">

        <Row>
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
          responsePolicies={config.get('response_policies')}/>
        {this.state.activeRulePath ?
          <Modal show={true}
            dialogClassName="configuration-sidebar"
            backdrop={false}
            onHide={this.clearActiveRule}>
            <Modal.Header>
              <h1>Add Cache Rule</h1>
              <p>Lorem ipsum dolor</p>
            </Modal.Header>
            <Modal.Body>
              <ConfigurationPolicyRuleEdit
                rule={config.getIn(this.state.activeRulePath)}
                rulePath={this.state.activeRulePath}
                changeActiveRuleType={this.changeActiveRuleType}
                hideAction={this.clearActiveRule}/>
            </Modal.Body>
          </Modal>
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
