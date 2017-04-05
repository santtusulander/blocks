import React from 'react'
import { Table } from 'react-bootstrap'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {FormattedMessage, injectIntl} from 'react-intl'

import Confirmation from '../confirmation.jsx'
import ActionButtons from '../../components/shared/action-buttons.jsx'
import {
  parsePolicy
} from '../../util/policy-config'

import { MODIFY_PROPERTY, DELETE_PROPERTY } from '../../constants/permissions'

class ConfigurationPolicyRules extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defaults: null,
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
    const policyMapper = type => (rule, i) => {
      const { matches, sets, default_sets } = parsePolicy(rule, [])
      const matchLabel = matches.map(match => match.field).join(', ')
      const actionsLabel = sets.map(set => set.setkey).join(', ')
      const defaultActionsLabel = default_sets.map(set => set.setkey).join(', ')

      const actionButtons = (
        <ActionButtons
          permissions={{ modify: MODIFY_PROPERTY, delete: DELETE_PROPERTY }}
          onEdit={this.activateRule([`${type}_policy`, 'policy_rules', i])}
          onDelete={this.showConfirmation(`${type}_policy`, i)} />
      )

      return (
        <tr key={rule + i}>
          <td>{rule.get('rule_name')}</td>
          <td className="text-right">{type}</td>
          <td>{matchLabel}</td>
          <td>{actionsLabel}</td>
          <td>{defaultActionsLabel}</td>
          <td className="nowrap-column">
            {actionButtons}
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
              <th><FormattedMessage id="portal.policy.edit.rules.defaultActions.text"/></th>
              <th width="1%" />
            </tr>
          </thead>
          <tbody>
            {rows}
            {isEmpty ? <tr>
              <td colSpan={6}>
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
