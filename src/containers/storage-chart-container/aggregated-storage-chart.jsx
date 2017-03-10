import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { List } from 'immutable'

import StorageItemChart from '../../components/content/storage-item-chart'

import { formatBytes, separateUnit } from '../../util/helpers'

const FORMAT = '0'
const emptyList = List()

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
        locations={emptyList}
        name={<FormattedMessage id="portal.account.storage.table.usage.text" />}
        currentUsage={bytes.average}
        estimate={estimate}
        peak={bytes.peak}/>
    </div>
  )
}

AggregatedStorageChart.displayName = "AggregatedStorageChart"

AggregatedStorageChart.propTypes = {
  bytes: PropTypes.object,
  estimate: PropTypes.number
}

export default AggregatedStorageChart
