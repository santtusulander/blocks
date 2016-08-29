import React from 'react'

import {FormattedMessage} from 'react-intl'

class ConfigurationPerformance extends React.Component {
  render() {
    return (
      <div className="configuration-performance">
        <h2><FormattedMessage id="portal.policy.edit.performance.text"/></h2>
      </div>
    )
  }
}

ConfigurationPerformance.displayName = 'ConfigurationPerformance'
ConfigurationPerformance.propTypes = {}

module.exports = ConfigurationPerformance
