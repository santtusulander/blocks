import React from 'react'
import {Table} from 'react-bootstrap'

import {FormattedMessage} from 'react-intl'

class ConfigurationDefaultPolicies extends React.Component {
  render() {
    return (
      <div className="configuration-default-policies">
        <Table striped={true}>
          <thead>
            <tr>
              <th><FormattedMessage id="portal.policy.edit.defaultPolicies.ruleType.text"/></th>
              <th>TTL Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><FormattedMessage id="portal.policy.edit.defaultPolicies.errorResponse.text"/></td>
              <td>10 s</td>
              <td><a href="#">edit</a></td>
            </tr>
            <tr>
              <td><FormattedMessage id="portal.policy.edit.defaultPolicies.redirect.text"/></td>
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
