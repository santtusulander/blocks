import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import StorageItemChart from '../../components/content/storage-item-chart'

import { formatBytes, separateUnit } from '../../util/helpers'

const FORMAT = '0'
const emptyArray = []

const AggregatedStorageChart = ({ bytes, estimate }) => {
  return (
    <div className="aggregate-storage-starburst-wrapper">
      <div id="storage-item-peak-info">
        <h4><FormattedMessage id="portal.analytics.peak.text" /></h4>
        <div className="usage">
          <h2>
            {separateUnit(formatBytes(bytes.peak, null, FORMAT)).value}
          </h2>
          <h5>
            {separateUnit(formatBytes(bytes.peak, null, FORMAT)).unit}
          </h5>
        </div>
      </div>
      <StorageItemChart
        locations={emptyArray}
        name={<FormattedMessage id="portal.account.storages.table.usage.text" />}
        currentUsage={bytes.average}
        estimate={estimate}
        peak={bytes.peak}/>
    </div>
  )
}

AggregatedStorageChart.displayName = "AggregateStorageStarburstWrapper"

AggregatedStorageChart.propTypes = {
  bytes: PropTypes.object,
  estimate: PropTypes.number
}

export default AggregatedStorageChart
