import React from 'react'
import { Button } from 'react-bootstrap'
import Immutable from 'immutable'
import {FormattedMessage, injectIntl} from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import ConfigurationPolicyRules from './policy-rules'
import ConfigurationPolicyRuleEdit from './policy-rule-edit'
import IconAdd from '../shared/icons/icon-add.jsx'
import ConfigurationSidebar from './sidebar'
import IsAllowed from '../is-allowed'
import LoadingSpinner from '../loading-spinner/loading-spinner'

import { getActiveMatchSetForm } from './helpers'
import { isPolicyRuleEmpty } from '../../util/policy-config'
import { MODIFY_PROPERTY } from '../../constants/permissions'
import { POLICY_TYPES, DEFAULT_RULE } from '../../constants/property-config'

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
    this.handleCancel = this.handleCancel.bind(this)
    this.changeActiveRuleType = this.changeActiveRuleType.bind(this)
    this.cancelActiveMatchSetEditForm = this.cancelActiveMatchSetEditForm.bind(this)
  }


  /**
   * If URL has parameters for editing a policy, open the edit-modal for that policy
   */
  componentWillMount() {
    const { activateRule, params: { editOrDelete, policyId, policyType } } = this.props
    if (editOrDelete === 'edit') {
      activateRule([policyType, 'policy_rules', Number(policyId)])
    }
  }

  componentWillUnmount() {
    if (this.props.activeRule) {
      this.handleCancel()
    }
  }

  addRule(policyType) {
    this.setState({ isEditingRule: false })

    const policyRules = this.props.config.getIn([policyType, 'policy_rules']).push(DEFAULT_RULE)
    this.props.changeValue([policyType, 'policy_rules'], policyRules)
    this.props.activateRule([policyType, 'policy_rules', policyRules.size - 1])
  }

  changeActiveRuleType(policyType) {
    if ([
      POLICY_TYPES.REQUEST,
      POLICY_TYPES.FINAL_REQUEST,
      POLICY_TYPES.RESPONSE,
      POLICY_TYPES.FINAL_RESPONSE
    ].indexOf(policyType) === -1) {
      return
    }

    const oldRulePath = this.props.activeRule
    const oldRuleType = oldRulePath.get(0)
    const oldRuleIndex = oldRulePath.get(2)
    const oldRuleset = this.props.config.getIn([oldRuleType, 'policy_rules']).splice(oldRuleIndex, 1)
    const ruleName = this.props.config.getIn(oldRulePath).get('rule_name')
    const newMatch = ruleName ? DEFAULT_RULE.set('rule_name', ruleName) : DEFAULT_RULE
    const newRuleset = this.props.config.getIn([policyType, 'policy_rules'], Immutable.List()).push(newMatch)
    this.props.changeValues([
      [[oldRuleType, 'policy_rules'], oldRuleset],
      [[policyType, 'policy_rules'], newRuleset]
    ])
    this.props.activateRule([policyType, 'policy_rules', newRuleset.size - 1])
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

  handleHide() {
    this.props.cancelEditPolicyRoute()
    this.setState({ isEditingRule: true })
    this.props.activateRule(null)
  }

  handleCancel() {
    if (isPolicyRuleEmpty(this.props.config, this.props.activeRule)) {
      const ruleType = this.props.activeRule.get(0)
      const ruleIndex = this.props.activeRule.get(2)

      this.deleteRule(ruleType, ruleIndex)
    } else {
      this.handleChange([])(this.props.originalConfig)
    }

    this.handleHide()
  }

  cancelActiveMatchSetEditForm() {
    const { config, activeMatch, activeSet, activateMatch, activateSet } = this.props

    if (activeMatch) {
      config.getIn(activeMatch).get('_temp') && this.deleteTempItem(activeMatch)

      activateMatch(null)
    }

    if (activeSet) {
      config.getIn(activeSet).get('_temp') && this.deleteTempItem(activeSet)
      activateSet(null)
    }
  }

  deleteTempItem(path) {
    const { config, changeValue } = this.props
    const parentPath = path.slice(0, -1)

    const filtered = config.getIn(parentPath)
        .filterNot(val => val.get('_temp'))

    changeValue(parentPath, filtered)
  }

  render() {
    const config = this.props.config;
    if (!config || !config.size) {
      return (
        <div className="container"><LoadingSpinner /></div>
      )
    }
    const activeEditFormActions = {
      changeValue: this.props.changeValue,
      formatMessage: this.props.intl.formatMessage,
      activateSet: this.props.activateSet,
      activateMatch: this.props.activateMatch,
      cancelActiveEditForm: this.cancelActiveMatchSetEditForm
    }
    const activeEditForm = getActiveMatchSetForm(
      this.props.activeRule ? config.getIn(this.props.activeRule) : null,
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
              onClick={() => {
                this.addRule(POLICY_TYPES.REQUEST) 
              }}>
              <IconAdd />
            </Button>
          </IsAllowed>
        </SectionHeader>
        <SectionContainer>
          <ConfigurationPolicyRules
            cancelDeletePolicyRoute={this.props.cancelEditPolicyRoute}
            params={this.props.params}
            requestPolicies={config.getIn([POLICY_TYPES.REQUEST, 'policy_rules'])}
            responsePolicies={config.getIn([POLICY_TYPES.RESPONSE, 'policy_rules'])}
            finalRequestPolicies={config.getIn([POLICY_TYPES.FINAL_REQUEST, 'policy_rules'])}
            finalResponsePolicies={config.getIn([POLICY_TYPES.FINAL_RESPONSE, 'policy_rules'])}
            activateRule={this.props.activateRule}
            deleteRule={this.deleteRule}/>
          {this.props.activeRule ?
            <ConfigurationSidebar
              rightColVisible={!!activeEditForm}
              handleRightColClose={this.cancelActiveMatchSetEditForm}
              onHide={this.handleCancel}
              rightColContent={activeEditForm}>
              <ConfigurationPolicyRuleEdit
                activateMatch={this.props.activateMatch}
                activateSet={this.props.activateSet}
                activeMatchPath={this.props.activeMatch}
                activeSetPath={this.props.activeSet}
                cancelActiveEditForm={this.cancelActiveMatchSetEditForm}
                changeValue={this.props.changeValue}
                config={config}
                rule={config.getIn(this.props.activeRule)}
                rulePath={this.props.activeRule}
                changeActiveRuleType={this.changeActiveRuleType}
                cancelAction={this.handleCancel}
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

ConfigurationPolicies.defaultProps = { params: {} }
ConfigurationPolicies.propTypes = {
  activateMatch: React.PropTypes.func,
  activateRule: React.PropTypes.func,
  activateSet: React.PropTypes.func,
  activeMatch: React.PropTypes.instanceOf(Immutable.List),
  activeRule: React.PropTypes.instanceOf(Immutable.List),
  activeSet: React.PropTypes.instanceOf(Immutable.List),
  cancelEditPolicyRoute: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  changeValues: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  intl: React.PropTypes.object,
  originalConfig: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  saveChanges: React.PropTypes.func
}

module.exports = injectIntl(ConfigurationPolicies)
