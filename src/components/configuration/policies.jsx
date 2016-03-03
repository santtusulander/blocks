import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationPolicyRules from './policy-rules'
import ConfigurationPolicyRuleEdit from './policy-rule-edit'
import IconAdd from '../icons/icon-add.jsx'
import ConfigurationSidebar from './sidebar'

import ConfigurationMatchHostname from './matches/hostname'
import ConfigurationMatchDirectoryPath from './matches/directory-path'
import ConfigurationMatchMimeType from './matches/mime-type'
import ConfigurationMatchFileExtension from './matches/file-extension'
import ConfigurationMatchFileName from './matches/file-name'
import ConfigurationMatchQueryString from './matches/query-string'
import ConfigurationMatchHeader from './matches/header'
import ConfigurationMatchCookie from './matches/cookie'
import ConfigurationMatchIpAddress from './matches/ip-address'

import ConfigurationActionCache from './actions/cache'
import ConfigurationActionCacheKeyQueryString from './actions/cache-key-query-string'
import ConfigurationActionRedirection from './actions/redirection'
import ConfigurationActionOriginHostname from './actions/origin-hostname'
import ConfigurationActionCompression from './actions/compression'
import ConfigurationActionPath from './actions/path'
import ConfigurationActionQueryString from './actions/query-string'
import ConfigurationActionHeader from './actions/header'
import ConfigurationActionRemoveVary from './actions/remove-vary'
import ConfigurationActionAllowBlock from './actions/allow-block'
import ConfigurationActionPostSupport from './actions/post-support'
import ConfigurationActionCors from './actions/cors'

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
          responsePolicies={config.get('response_policies')}
          activateRule={this.activateRule}/>
        {this.state.activeRulePath ?
          <ConfigurationSidebar
            rightColVisible={this.state.rightColVisible}
            handleRightColClose={this.handleRightColClose}
            onHide={this.clearActiveRule}
            rightColContent={
              // <ConfigurationMatchHostname
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationMatchDirectoryPath
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationMatchMimeType
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationMatchFileExtension
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationMatchFileName
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationMatchQueryString
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationMatchHeader
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationMatchCookie
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationMatchIpAddress
              //   changeValue={this.props.changeValue}/>

              // <ConfigurationActionCache
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionCacheKeyQueryString
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionRedirection
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionOriginHostname
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionCompression
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionPath
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionQueryString
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionHeader
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionRemoveVary
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionAllowBlock
              //   changeValue={this.props.changeValue}/>
              // <ConfigurationActionPostSupport
              //   changeValue={this.props.changeValue}/>
              <ConfigurationActionCors
                changeValue={this.props.changeValue}/>
            }>
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
