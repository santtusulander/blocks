import React from 'react'
import {Table} from 'react-bootstrap'
import Immutable from 'immutable'

function parsePolicy(policy) {
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
  render() {
    if(!this.props.requestPolicies) {
      return <div>Loading...</div>
    }
    return (
      <div className="configuration-cache-rules">
        <Table striped={true}>
          <thead>
            <tr>
              <th>Policy</th>
              <th>Match Conditions</th>
              <th>Match</th>
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
                  <td>NEEDS_API</td>
                  <td>{sets.join(', ')}</td>
                  <td><a href="#">edit</a> <a href="#">delete</a></td>
                </tr>
              )
            })}
            {this.props.responsePolicies.map((policy, i) => {
              const {matches, sets} = parsePolicy(policy)
              return (
                <tr key={i}>
                  <td>NEEDS_API</td>
                  <td>{matches.join(', ')}</td>
                  <td>NEEDS_API</td>
                  <td>{sets.join(', ')}</td>
                  <td><a href="#">edit</a> <a href="#">delete</a></td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }
}

ConfigurationPolicyRules.displayName = 'ConfigurationPolicyRules'
ConfigurationPolicyRules.propTypes = {
  requestPolicies: React.PropTypes.instanceOf(Immutable.List),
  responsePolicies: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = ConfigurationPolicyRules
