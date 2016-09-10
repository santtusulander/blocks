import React from 'react'

import { FormattedMessage } from 'react-intl'

class ConfigurationSecurity extends React.Component {
  render() {
    return (
      <div className="configuration-security">
        <h2><FormattedMessage id="portal.policy.edit.security.text"/></h2>
      </div>
    )
  }
}

ConfigurationSecurity.displayName = 'ConfigurationSecurity'
ConfigurationSecurity.propTypes = {}

module.exports = ConfigurationSecurity
