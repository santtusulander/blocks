import React from 'react'
import { Button, Table } from 'react-bootstrap'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Confirmation from '../confirmation.jsx'
import IconTrash from '../icons/icon-trash.jsx'
import {parsePolicy} from '../../util/policy-config'

import {FormattedMessage, injectIntl} from 'react-intl'

class ConfigurationPolicyRules extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      request_policy: null,
      response_policy: null
    }

    this.activateRule = this.activateRule.bind(this)
    this.deleteRule = this.deleteRule.bind(this)
    this.showConfirmation = this.showConfirmation.bind(this)
    this.closeConfirmation = this.closeConfirmation.bind(this)
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
    }
  }
  render() {
    if(!this.props.requestPolicies) {
      return <div>Loading...</div>
    }
    const isEmpty = (this.props.responsePolicies.size + this.props.requestPolicies.size) < 1
    return (
      <div className="configuration-cache-rules">
        <Table striped={true}>
          <thead>
            <tr>
              <th><FormattedMessage id="portal.policy.edit.rules.policy.text"/></th>
              <th><FormattedMessage id="portal.policy.edit.rules.matchConditions.text"/></th>
              <th><FormattedMessage id="portal.policy.edit.rules.actions.text"/></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.requestPolicies.map((policy, i) => {
              const {matches, sets} = parsePolicy(policy, [])
              return (
                <tr key={i}>
                  <td>{policy.get('rule_name')}</td>
                  <td>{matches.map(match => match.field).join(', ')}</td>
                  <td>{sets.map(set => set.setkey).join(', ')}</td>
                  <td className="right-btns has-confirmation">
                    <Button bsStyle="primary" className="btn-link sm-padding"
                      onClick={this.activateRule(['request_policy', 'policy_rules', i])}>
                      <FormattedMessage id="portal.button.EDIT"/>
                    </Button>
                    <Button bsStyle="primary"
                      className="btn-link btn-icon"
                      onClick={this.showConfirmation('request_policy', i)}>
                      <IconTrash/>
                    </Button>
                    {this.state.request_policy !== false &&
                      <ReactCSSTransitionGroup
                        component="div"
                        className="confirmation-transition"
                        transitionName="confirmation-transition"
                        transitionEnterTimeout={10}
                        transitionLeaveTimeout={500}
                        transitionAppear={true}
                        transitionAppearTimeout={10}>
                        {this.state.request_policy === i &&
                          <Confirmation
                            cancelText={this.props.intl.formatMessage({id: 'portal.button.no'})}
                            confirmText={this.props.intl.formatMessage({id: 'portal.button.yes'})}
                            handleConfirm={this.deleteRule('request_policy', i)}
                            handleCancel={this.closeConfirmation('request_policy')}>
                            <FormattedMessage id="portal.policy.edit.rules.deleteRuleConfirmation.text"/>
                          </Confirmation>
                        }
                      </ReactCSSTransitionGroup>
                    }
                  </td>
                </tr>
              )
            })}
            {this.props.responsePolicies.map((policy, i) => {
              const {matches, sets} = parsePolicy(policy, [])
              return (
                <tr key={i}>
                  <td>{policy.get('rule_name')}</td>
                  <td>{matches.map(match => match.field).join(', ')}</td>
                  <td>{sets.map(set => set.setkey).join(', ')}</td>
                  <td className="right-btns has-confirmation">
                    <Button bsStyle="primary" className="btn-link sm-padding"
                      onClick={this.activateRule(['response_policy', 'policy_rules', i])}>
                      <FormattedMessage id="portal.button.EDIT"/>
                    </Button>
                    <Button bsStyle="primary"
                      className="btn-link btn-icon"
                      onClick={this.showConfirmation('response_policy', i)}>
                      <IconTrash/>
                    </Button>
                    {this.state.response_policy !== false &&
                      <ReactCSSTransitionGroup
                        component="div"
                        className="confirmation-transition"
                        transitionName="confirmation-transition"
                        transitionEnterTimeout={10}
                        transitionLeaveTimeout={500}
                        transitionAppear={true}
                        transitionAppearTimeout={10}>
                        {this.state.response_policy === i &&
                          <Confirmation
                            cancelText={this.props.intl.formatMessage({id: 'portal.button.no'})}
                            confirmText={this.props.intl.formatMessage({id: 'portal.button.yes'})}
                            handleConfirm={this.deleteRule('response_policy', i)}
                            handleCancel={this.closeConfirmation('response_policy')}>
                            <FormattedMessage id="portal.policy.edit.rules.deleteRuleConfirmation.text"/>
                          </Confirmation>
                        }
                      </ReactCSSTransitionGroup>
                    }
                  </td>
                </tr>
              )
            })}
            {isEmpty ? <tr>
              <td colSpan={4}>
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
  deleteRule: React.PropTypes.func,
  intl: React.PropTypes.object,
  requestPolicies: React.PropTypes.instanceOf(Immutable.List),
  responsePolicies: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = injectIntl(ConfigurationPolicyRules)
