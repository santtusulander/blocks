import React from 'react'
import { FormattedMessage } from 'react-intl'

const ConfigurationPerformance = () => {
  return (
    <div className="configuration-performance">
      <h2><FormattedMessage id="portal.policy.edit.performance.text"/></h2>
    </div>
  )
}

ConfigurationPerformance.displayName = 'ConfigurationPerformance'
ConfigurationPerformance.propTypes = {}

export default ConfigurationPerformance
