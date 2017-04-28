import React from 'react'

import { FormattedMessage } from 'react-intl'

const ConfigurationChangeLog = () => {
  return (
    <div className="configuration-change-log">
      <h2><FormattedMessage id="portal.policy.edit.changeLog.header"/></h2>
    </div>
  )
}

ConfigurationChangeLog.displayName = 'ConfigurationChangeLog'
ConfigurationChangeLog.propTypes = {}

export default ConfigurationChangeLog
