import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import { formatBytes } from '../../util/helpers'

const StorageItemTooltip = ({ name, valuesFormat, currentUsage, peak, lastMonthUsage, lastMonthPeak }) => (
  <div className="storage-item-inner-tooltip">
    <h3>{name}</h3>
    <div className="storage-month-info">
      <FormattedMessage id="portal.account.storage.tooltip.currentUsage"/>
      <span className="tooltip-storage-value">{formatBytes(currentUsage, null, valuesFormat)}</span>
      <br />
      <FormattedMessage id="ortal.account.storage.tooltip.currentUsage"/>
      <span className="tooltip-storage-value">{formatBytes(peak, null, valuesFormat)}</span>
    </div>
    <div className="storage-month-info">
      <FormattedMessage id="ortal.account.storage.tooltip.currentUsage"/>
      <span className="tooltip-storage-value">{formatBytes(lastMonthUsage, null, valuesFormat)}</span>
      <br />
      <FormattedMessage id="ortal.account.storage.tooltip.currentUsage"/>
      <span className="tooltip-storage-value">{formatBytes(lastMonthPeak, null, valuesFormat)}</span>
    </div>
  </div>
)

StorageItemTooltip.displayName = "StorageItemTooltip"
StorageItemTooltip.propTypes = {
  currentUsage: PropTypes.number,
  lastMonthPeak: PropTypes.number,
  lastMonthUsage: PropTypes.number,
  name: PropTypes.string,
  peak:PropTypes.number,
  valuesFormat: PropTypes.string
}

export default StorageItemTooltip
