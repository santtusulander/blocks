import React from 'react'
import { Table } from 'react-bootstrap'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {FormattedMessage, injectIntl} from 'react-intl'

import Confirmation from '../confirmation.jsx'
import ActionButtons from '../../components/action-buttons.jsx'
import {
  getScriptLua,
  matchIsContentTargeting,
  actionIsTokenAuth,
  parsePolicy,
  parseCountriesByResponseCodes,
  ALLOW_RESPONSE_CODES,
  DENY_RESPONSE_CODES,
  REDIRECT_RESPONSE_CODES
} from '../../util/policy-config'

import { MODIFY_PROPERTY, DELETE_PROPERTY } from '../../constants/permissions'

import IsAdmin from '../is-admin'

class ConfigurationPolicyRules extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      default_policy: null,
      request_policy: null,
      final_request_policy: null,
      response_policy: null,
      final_response_policy: null
    }

    this.activateRule = this.activateRule.bind(this)
    this.deleteRule = this.deleteRule.bind(this)
    this.showConfirmation = this.showConfirmation.bind(this)
    this.closeConfirmation = this.closeConfirmation.bind(this)
  }
  componentWillMount() {
    const { editOrDelete, policyId, policyType } = this.props.params
    if (editOrDelete === 'delete') {
      this.showConfirmation(policyType, Number(policyId))()
    }
  }
  activateRule(rulePath) {
    return e => {
      e.preventDefault()
      this.props.activateRule(rulePath)
    }
  }
  deleteRule(policyType, index) {
    return e => {
      e.preventDefault()
      this.props.deleteRule(policyType, index)
      this.setState({
        [policyType]: false
      })
      this.props.cancelDeletePolicyRoute()
    }
  }
  showConfirmation(policyType, index) {
    return () => {
      this.setState({
        [policyType]: index
      })
    }
  }
  closeConfirmation(policyType) {
    return () => {
      this.setState({
        [policyType]: null
      })
      this.props.cancelDeletePolicyRoute()
    }
  }
  render() {
    const policyMapper = type => (policy, i) => {
      if(!policy.has('match')) {
        return null
      }

      const {matches, sets} = parsePolicy(policy, [])

      /* Check if matches have content targeting and show 'friendly labels' (list of countries by action) */
      let matchLabel = ''
      let actionsLabel = ''
      if ( matchIsContentTargeting(policy.get('match') )) {
        matchLabel = this.props.intl.formatMessage({id: 'portal.configuration.policies.contentTargeting.text'})
        actionsLabel = ''

        const scriptLua = getScriptLua( policy )

        const allowCountries = parseCountriesByResponseCodes( scriptLua, ALLOW_RESPONSE_CODES)
        const denyCountries = parseCountriesByResponseCodes( scriptLua, DENY_RESPONSE_CODES)
        const redirectCountries = parseCountriesByResponseCodes( scriptLua, REDIRECT_RESPONSE_CODES)

        let ctActionLabels = []
        if ( allowCountries.length ) ctActionLabels.push( `${this.props.intl.formatMessage({id: 'portal.configuration.policies.allow.text'})}: ${allowCountries.join(', ')}` )
        if ( denyCountries.length ) ctActionLabels.push( `${this.props.intl.formatMessage({id: 'portal.configuration.policies.deny.text'})}: ${denyCountries.join(', ')}` )
        if ( redirectCountries.length ) ctActionLabels.push( `${this.props.intl.formatMessage({id: 'portal.configuration.policies.redirect.text'})}: ${redirectCountries.join(', ')}` )

        actionsLabel = ctActionLabels.join(' | ')

      } else {
        matchLabel = matches.map(match => match.field).join(', ')
        actionsLabel = sets.map(set => set.setkey).join(', ')
      }

      {/*
        TODO: remove UDN admin checks as part of UDNP-1713
        Allow CT / TA modification only for UDN Admin
      */}
      const ruleNeedsAdmin = matchIsContentTargeting(policy.get('match')) || actionIsTokenAuth(sets)
      const actionButtons = (
        <ActionButtons
          permissions={{ modify: MODIFY_PROPERTY, delete: DELETE_PROPERTY }}
          onEdit={this.activateRule([`${type}_policy`, 'policy_rules', i])}
          onDelete={this.showConfirmation(`${type}_policy`, i)} />
      )

      return (
        <tr key={policy + i}>
          <td>{policy.get('rule_name')}</td>
          <td className="text-right">{type}</td>
          <td>{matchLabel}</td>
          <td>{actionsLabel}</td>
          <td className="nowrap-column">
            {/* Allow CT / TA modification only for UDN Admin */}
            {ruleNeedsAdmin ?
              <IsAdmin>
                {actionButtons}
              </IsAdmin>
              :
              actionButtons
            }
            {this.state[`${type}_policy`] !== false &&
              <ReactCSSTransitionGroup
                component="div"
                className="confirmation-transition"
                transitionName="confirmation-transition"
                transitionEnterTimeout={10}
                transitionLeaveTimeout={500}
                transitionAppear={true}
                transitionAppearTimeout={10}>
                {this.state[`${type}_policy`] === i &&
                  <Confirmation
                    cancelText={this.props.intl.formatMessage({id: 'portal.button.no'})}
                    confirmText={this.props.intl.formatMessage({id: 'portal.button.yes'})}
                    handleConfirm={this.deleteRule(`${type}_policy`, i)}
                    handleCancel={this.closeConfirmation(`${type}_policy`)}>
                    <FormattedMessage id="portal.policy.edit.rules.deleteRuleConfirmation.text"/>
                  </Confirmation>
                }
              </ReactCSSTransitionGroup>
            }
          </td>
        </tr>
      )
    }

    const rows = [
      ...this.props.defaultPolicies.map(policyMapper('default')),
      ...this.props.requestPolicies.map(policyMapper('request')),
      ...this.props.finalRequestPolicies.map(policyMapper('final_request')),
      ...this.props.responsePolicies.map(policyMapper('response')),
      ...this.props.finalResponsePolicies.map(policyMapper('final_response'))
    ]
    const isEmpty = !rows.filter(Boolean).length
    return (
      <div className="configuration-cache-rules">
        <Table striped={true}>
          <thead>
            <tr>
              <th><FormattedMessage id="portal.policy.edit.rules.policy.text"/></th>
              <th className="text-right"><FormattedMessage id="portal.policy.edit.rules.type.text"/></th>
              <th><FormattedMessage id="portal.policy.edit.rules.matchConditions.text"/></th>
              <th><FormattedMessage id="portal.policy.edit.rules.actions.text"/></th>
              <th width="1%" />
            </tr>
          </thead>
          <tbody>
            {rows}
            {isEmpty ? <tr>
              <td colSpan={5}>
                <FormattedMessage id="portal.policy.edit.rules.noRulesAdded.text"/>
              </td>
            </tr>
            : null}
          </tbody>
        </Table>
      </div>
    )
  }
}

ConfigurationPolicyRules.displayName = 'ConfigurationPolicyRules'
ConfigurationPolicyRules.propTypes = {
  activateRule: React.PropTypes.func,
  cancelDeletePolicyRoute: React.PropTypes.func,
  defaultPolicies: React.PropTypes.instanceOf(Immutable.List),
  deleteRule: React.PropTypes.func,
  finalRequestPolicies: React.PropTypes.instanceOf(Immutable.List),
  finalResponsePolicies: React.PropTypes.instanceOf(Immutable.List),
  intl: React.PropTypes.object,
  params: React.PropTypes.object,
  requestPolicies: React.PropTypes.instanceOf(Immutable.List),
  responsePolicies: React.PropTypes.instanceOf(Immutable.List)
}
ConfigurationPolicyRules.defaultProps = {
  params: {},
  defaultPolicies: Immutable.List(),
  finalRequestPolicies: Immutable.List(),
  finalResponsePolicies: Immutable.List(),
  requestPolicies: Immutable.List(),
  responsePolicies: Immutable.List()
}

export default injectIntl(ConfigurationPolicyRules)
