import React from 'react'
import { Button, Table } from 'react-bootstrap'
import Immutable from 'immutable'

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

    this.activateRule = this.activateRule.bind(this)
    this.deleteRule = this.deleteRule.bind(this)
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
                  <td>NEEDS_API</td>
                  <td>{matches.join(', ')}</td>
                  <td>{sets.join(', ')}</td>
                  <td className="right-btns">
                    <Button bsStyle="primary" className="btn-link sm-padding"
                      onClick={this.activateRule(['request_policy', 'policy_rules', i])}>
                      EDIT
                    </Button>
                    <Button bsStyle="primary"
                      className="btn-link btn-icon"
                      onClick={this.deleteRule('request_policy', i)}>
                      <IconTrash/>
                    </Button>
                  </td>
                </tr>
              )
            })}
            {this.props.responsePolicies.map((policy, i) => {
              const {matches, sets} = parsePolicy(policy)
              return (
                <tr key={i}>
                  <td>NEEDS_API</td>
                  <td>{matches.join(', ')}</td>
                  <td>{sets.join(', ')}</td>
                  <td className="right-btns">
                    <Button bsStyle="primary" className="btn-link sm-padding"
                      onClick={this.activateRule(['response_policy', 'policy_rules', i])}>
                      EDIT
                    </Button>
                    <Button bsStyle="primary"
                      className="btn-link btn-icon"
                      onClick={this.deleteRule('response_policy', i)}>
                      <IconTrash/>
                    </Button>
                  </td>
                </tr>
              )
            })}
            {isEmpty ? <tr>
              <td colSpan={4}>
                No policies rules have been added yet.
              </td>
            </tr>
            : ''}
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
