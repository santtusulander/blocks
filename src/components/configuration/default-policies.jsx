import React from 'react'
import {Table} from 'react-bootstrap'

class ConfigurationDefaultPolicies extends React.Component {
  render() {
    return (
      <div className="configuration-default-policies">
        <Table striped={true} bordered={true} hover={true}>
          <thead>
            <tr>
              <th>Rule Type</th>
              <th>TTL Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DEFAULT</td>
              <td>no-store</td>
              <td><a href="#">edit</a></td>
            </tr>
            <tr>
              <td>Error Response</td>
              <td>10 s</td>
              <td><a href="#">edit</a></td>
            </tr>
            <tr>
              <td>Redirect</td>
              <td>no-store</td>
              <td><a href="#">edit</a></td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}

ConfigurationDefaultPolicies.displayName = 'ConfigurationDefaultPolicies'
ConfigurationDefaultPolicies.propTypes = {}

module.exports = ConfigurationDefaultPolicies
