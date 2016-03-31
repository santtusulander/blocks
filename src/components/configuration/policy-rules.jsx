import React from 'react'
import { Button, Table } from 'react-bootstrap'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Confirmation from '../confirmation.jsx'
import IconTrash from '../icons/icon-trash.jsx'

function parsePolicy(policy) {
  if(!policy) {
    return {
      matches: [],
      sets: []
    }
  }
  if(policy.has('match')) {
    let {combinedMatches, combinedSets} = policy.get('match').get('cases').reduce((fields, policyCase) => {
      const {matches, sets} = parsePolicy(policyCase.get(1).get(0))
      fields.combinedMatches = fields.combinedMatches.concat(matches)
      fields.combinedSets = fields.combinedSets.concat(sets)
      return fields
    }, {combinedMatches: [], combinedSets: []})
    combinedMatches.push(policy.get('match').get('field'))
    return {
      matches: combinedMatches,
      sets: combinedSets
    }
  }
  else if(policy.has('set')) {
    return {
      matches: [],
      sets: policy.get('set').keySeq().toArray()
    }
  }
}

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
              <th>Policy</th>
              <th>Match Conditions</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.requestPolicies.map((policy, i) => {
              const {matches, sets} = parsePolicy(policy)
              return (
                <tr key={i}>
                  <td>{policy.get('rule_name')}</td>
                  <td>{matches.join(', ')}</td>
                  <td>{sets.join(', ')}</td>
                  <td className="right-btns has-confirmation">
                    <Button bsStyle="primary" className="btn-link sm-padding"
                      onClick={this.activateRule(['request_policy', 'policy_rules', i])}>
                      EDIT
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
                            cancelText="No"
                            confirmText="Yes"
                            handleConfirm={this.deleteRule('request_policy', i)}
                            handleCancel={this.closeConfirmation('request_policy')}>
                            Are you sure you want to delete the rule?
                          </Confirmation>
                        }
                      </ReactCSSTransitionGroup>
                    }
                  </td>
                </tr>
              )
            })}
            {this.props.responsePolicies.map((policy, i) => {
              const {matches, sets} = parsePolicy(policy)
              return (
                <tr key={i}>
                  <td>{policy.get('rule_name')}</td>
                  <td>{matches.join(', ')}</td>
                  <td>{sets.join(', ')}</td>
                  <td className="right-btns has-confirmation">
                    <Button bsStyle="primary" className="btn-link sm-padding"
                      onClick={this.activateRule(['response_policy', 'policy_rules', i])}>
                      EDIT
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
                            cancelText="No"
                            confirmText="Yes"
                            handleConfirm={this.deleteRule('response_policy', i)}
                            handleCancel={this.closeConfirmation('response_policy')}>
                            Are you sure you want to delete the rule?
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
                No policies rules have been added yet.
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
  requestPolicies: React.PropTypes.instanceOf(Immutable.List),
  responsePolicies: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = ConfigurationPolicyRules
