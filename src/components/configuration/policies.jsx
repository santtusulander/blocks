import React from 'react'
import { Button } from 'react-bootstrap'
import Immutable from 'immutable'
import {FormattedMessage, injectIntl} from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import ConfigurationPolicyRules from './policy-rules'
import ConfigurationPolicyRuleEdit from './policy-rule-edit'
import IconAdd from '../icons/icon-add.jsx'
import ConfigurationSidebar from './sidebar'
import IsAllowed from '../is-allowed'

import { getActiveMatchSetForm } from './helpers'
import { MODIFY_PROPERTY } from '../../constants/permissions'

class ConfigurationPolicies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditingRule: true
    }

    this.addRule = this.addRule.bind(this)
    this.deleteRule = this.deleteRule.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleHide = this.handleHide.bind(this)
    this.changeActiveRuleType = this.changeActiveRuleType.bind(this)
  }
  addRule(e) {
    e.preventDefault()
    this.setState({ isEditingRule: false })
    const reqPolicies = this.props.config.get('request_policy').get('policy_rules').push(Immutable.fromJS(
      {match: {field: null, cases: [['',[]]]}}
    ))
    this.props.changeValue(['request_policy', 'policy_rules'], reqPolicies)
    this.props.activateRule(['request_policy', 'policy_rules', reqPolicies.size - 1])
    this.props.activateMatch(['request_policy', 'policy_rules', reqPolicies.size - 1, 'match'])
  }
  deleteRule(policyType, index) {
    const newPolicies = this.props.config.get(policyType).get('policy_rules').splice(index, 1)
    this.props.changeValue([policyType, 'policy_rules'], newPolicies)
  }
  handleChange(path) {
    return value => this.props.changeValue(path, value)
  }
  handleSave(e) {
    e.preventDefault()
    this.props.saveChanges()
  }
  changeActiveRuleType(type) {
    let rulePath = this.props.activeRule
    if(type === 'request') {
      rulePath = rulePath.set(0, 'request_policy')
    }
    else if(type === 'response') {
      rulePath = rulePath.set(0, 'response_policy')
    }
    this.props.activateRule(rulePath)
  }
  handleHide(){
    this.setState({ isEditingRule: true })
    this.props.activateRule(null)
  }
  render() {
    let config = this.props.config;
    if(!config || !config.size) {
      return (
        <div className="container">Loading...</div>
      )
    }
    const activeEditFormActions = {
      changeValue: this.props.changeValue,
      formatMessage: this.props.intl.formatMessage,
      activateSet: this.props.activateSet
    }
    const activeEditForm = getActiveMatchSetForm(
      this.props.activeMatch,
      this.props.activeSet,
      config,
      activeEditFormActions
    )
    return (
      <div id="configuration-policies">
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.policy.edit.policies.policyRules.text"/>}>
          <IsAllowed to={MODIFY_PROPERTY}>
            <Button bsStyle="success" className="btn-icon"
              onClick={this.addRule}>
              <IconAdd />
            </Button>
          </IsAllowed>
        </SectionHeader>
        <SectionContainer>
          <ConfigurationPolicyRules
            requestPolicies={config.getIn(['request_policy','policy_rules'])}
            responsePolicies={config.getIn(['response_policy','policy_rules'])}
            activateRule={this.props.activateRule}
            deleteRule={this.deleteRule}/>
          {this.props.activeRule ?
            <ConfigurationSidebar
              rightColVisible={!!activeEditForm}
              handleRightColClose={()=>this.props.activateMatch(null)}
              onHide={()=>this.props.activateRule(null)}
              rightColContent={activeEditForm}>
              <ConfigurationPolicyRuleEdit
                activateMatch={this.props.activateMatch}
                activateSet={this.props.activateSet}
                activeMatchPath={this.props.activeMatch}
                activeSetPath={this.props.activeSet}
                changeValue={this.props.changeValue}
                config={config}
                rule={config.getIn(this.props.activeRule)}
                rulePath={this.props.activeRule}
                changeActiveRuleType={this.changeActiveRuleType}
                hideAction={this.handleHide}
                isEditingRule={this.state.isEditingRule}
              />
            </ConfigurationSidebar>
          : ''}
        </SectionContainer>
      </div>
    )
  }
}

ConfigurationPolicies.displayName = 'ConfigurationPolicies'
ConfigurationPolicies.propTypes = {
  activateMatch: React.PropTypes.func,
  activateRule: React.PropTypes.func,
  activateSet: React.PropTypes.func,
  activeMatch: React.PropTypes.instanceOf(Immutable.List),
  activeRule: React.PropTypes.instanceOf(Immutable.List),
  activeSet: React.PropTypes.instanceOf(Immutable.List),
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  intl: React.PropTypes.object,
  saveChanges: React.PropTypes.func
}

module.exports = injectIntl(ConfigurationPolicies)
