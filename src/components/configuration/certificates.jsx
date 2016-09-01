import React from 'react'

import { FormattedMessage } from 'react-intl'

class ConfigurationCertificates extends React.Component {
  render() {
    return (
      <div className="configuration-certificates">
        <h2><FormattedMessage id="portal.policy.edit.certificates.header"/></h2>
      </div>
    )
  }
}

ConfigurationCertificates.displayName = 'ConfigurationCertificates'
ConfigurationCertificates.propTypes = {}

module.exports = ConfigurationCertificates
