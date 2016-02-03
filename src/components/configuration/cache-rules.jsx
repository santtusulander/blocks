import React from 'react'
import {Table} from 'react-bootstrap'
import Immutable from 'immutable'

class ConfigurationCacheRules extends React.Component {
  render() {
    if(!this.props.requestPolicies) {
      return <div>Loading...</div>
    }
    return (
      <div className="configuration-cache-rules">
        <Table striped={true}>
          <thead>
            <tr>
              <th>Rule Priority</th>
              <th>Rule Type</th>
              <th>Rule</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.requestPolicies.map((policy, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{policy.get('match').get('field')}</td>
                  <td>{policy.get('match').get('cases').map(pcase => pcase.get(0)).join(', ')}</td>
                  <td><a href="#">edit</a> <a href="#">delete</a></td>
                </tr>
              )
            })}
            {this.props.responsePolicies.map((policy, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{policy.get('match').get('field')}</td>
                  <td>{policy.get('match').get('cases').map(pcase => pcase.get(0)).join(', ')}</td>
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

ConfigurationCacheRules.displayName = 'ConfigurationCacheRules'
ConfigurationCacheRules.propTypes = {
  requestPolicies: React.PropTypes.instanceOf(Immutable.List),
  responsePolicies: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = ConfigurationCacheRules
