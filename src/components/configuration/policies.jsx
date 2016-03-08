import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import Immutable from 'immutable'

import ConfigurationPolicyRules from './policy-rules'
import ConfigurationPolicyRuleEdit from './policy-rule-edit'
import IconAdd from '../icons/icon-add.jsx'
import ConfigurationSidebar from './sidebar'

import MatchesSelection from './matches-selection'
import ActionsSelection from './actions-selection'

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
      activeMatchPath: null,
      activeRulePath: null,
      activeSetPath: null
    }

    this.addRule = this.addRule.bind(this)
    this.clearActiveRule = this.clearActiveRule.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleRightColClose = this.handleRightColClose.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.changeActiveRuleType = this.changeActiveRuleType.bind(this)
    this.activateMatch = this.activateMatch.bind(this)
    this.activateRule = this.activateRule.bind(this)
    this.activateSet = this.activateSet.bind(this)
  }
  addRule(e) {
    e.preventDefault()
    const reqPolicies = this.props.config.get('request_policies').push(Immutable.fromJS(
      {match: {field: null, cases: [['',[]]]}}
    ))
    this.props.changeValue(['request_policies'], reqPolicies)
    this.setState({
      activeMatchPath: ['request_policies', reqPolicies.size - 1, 'match'],
      activeRulePath: ['request_policies', reqPolicies.size - 1],
      activeSetPath: null
    })
  }
  clearActiveRule() {
    this.setState({
      activeMatchPath: null,
      activeRulePath: null,
      activeSetPath: null
    })
  }
  handleChange(path) {
    return value => this.props.changeValue(path, value)
  }
  handleRightColClose() {
    this.setState({
      activeMatchPath: null,
      activeSetPath: null
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
    this.setState({
      activeMatchPath: null,
      activeRulePath: rulePath,
      activeSetPath: null
    })
  }
  activateRule(path) {
    this.setState({
      activeMatchPath: null,
      activeRulePath: path,
      activeSetPath: null
    })
  }
  activateMatch(path) {
    this.setState({
      activeMatchPath: path,
      activeSetPath: null
    })
  }
  activateSet(path) {
    this.setState({
      activeMatchPath: null,
      activeSetPath: path
    })
  }
  render() {
    let config = this.props.config;
    if(!config || !config.size) {
      return (
        <div className="container">Loading...</div>
      )
    }
    let activeEditForm = null
    if(this.state.activeMatchPath) {
      const activeMatch = this.props.config.getIn(this.state.activeMatchPath)
      switch(activeMatch.get('field')) {
        case 'response_header':
          activeEditForm = (
            <ConfigurationMatchHeader
              changeValue={this.props.changeValue}
              match={activeMatch}
              path={this.state.activeMatchPath}/>
          )
        break
        case 'request_path':
          activeEditForm = (
            <ConfigurationMatchDirectoryPath
              changeValue={this.props.changeValue}
              match={activeMatch}
              path={this.state.activeMatchPath}/>
          )
        break
        case 'request_host':
          activeEditForm = (
            <ConfigurationMatchHostname
              changeValue={this.props.changeValue}
              match={activeMatch}
              path={this.state.activeMatchPath}/>
          )
        break
        case 'request_cookie':
          activeEditForm = (
            <ConfigurationMatchCookie
              changeValue={this.props.changeValue}
              match={activeMatch}
              path={this.state.activeMatchPath}/>
          )
        break
        default:
          activeEditForm = (
            <MatchesSelection
              path={this.state.activeMatchPath}
              changeValue={this.props.changeValue}/>
          )
        break


            // <ConfigurationMatchMimeType
            //   changeValue={this.props.changeValue}/>
            // <ConfigurationMatchFileExtension
            //   changeValue={this.props.changeValue}/>
            // <ConfigurationMatchFileName
            //   changeValue={this.props.changeValue}/>
            // <ConfigurationMatchQueryString
            //   changeValue={this.props.changeValue}/>
            // <ConfigurationMatchIpAddress
            //   changeValue={this.props.changeValue}/>
      }
    }
    if(this.state.activeSetPath) {
      const activeSet = this.props.config.getIn(this.state.activeSetPath)
      switch(this.state.activeSetPath.slice(-1)[0]) {
        case 'cache_name':
          activeEditForm = (
            <ConfigurationActionCacheKeyQueryString
              changeValue={this.props.changeValue}
              path={this.state.activeSetPath}
              set={activeSet}/>
          )
        break
        case 'cache_control':
          activeEditForm = (
            <ConfigurationActionCache
              changeValue={this.props.changeValue}
              path={this.state.activeSetPath}
              set={activeSet}/>
          )
        break
        case 'header':
          activeEditForm = (
            <ConfigurationActionHeader
              changeValue={this.props.changeValue}
              path={this.state.activeSetPath}
              set={activeSet}/>
          )
        break
        default:
          activeEditForm = (
            <ActionsSelection
              activateSet={this.activateSet}
              config={this.props.config}
              path={this.state.activeSetPath}
              changeValue={this.props.changeValue}/>
          )
        break
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
            // <ConfigurationActionRemoveVary
            //   changeValue={this.props.changeValue}/>
            // <ConfigurationActionAllowBlock
            //   changeValue={this.props.changeValue}/>
            // <ConfigurationActionPostSupport
            //   changeValue={this.props.changeValue}/>
            // <ConfigurationActionCors
            //   changeValue={this.props.changeValue}/>
      }
    }
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
          <ConfigurationSidebar
            rightColVisible={!!activeEditForm}
            handleRightColClose={this.handleRightColClose}
            onHide={this.clearActiveRule}
            rightColContent={activeEditForm}>
            <ConfigurationPolicyRuleEdit
              activateMatch={this.activateMatch}
              activateSet={this.activateSet}
              activeMatchPath={this.state.activeMatchPath}
              activeSetPath={this.state.activeSetPath}
              changeValue={this.props.changeValue}
              config={this.props.config}
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
