import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { getById as getStorageById } from '../../redux/modules/entities/CIS-ingest-points/selectors'
import { buildReduxId } from '../../redux/util'

import StorageItemChart from '../../components/content/storage-item-chart'

const getStorageMetrics = () =>
({
  bytes: {
    ending: 108000497044939,
    peak: 71963080986145,
    low: 36037416058794,
    average: 54000248522470,
    percent_change: 50.00
  },
  historical_bytes: {
    ending: 108000497044939,
    peak: 71963080986145,
    low: 36037416058794,
    average: 54000248522470,
    percent_change: 50.00
  }
})

const StorageChartContainer = props => {

  const { clusters, id, estimated_usage } = props.entity
  const { bytes, historical_bytes } = props.entityMetrics

  return (
    <StorageItemChart
      analyticsLink='#'
      configurationLink='#'
      name={id}
      locations={clusters}
      currentUsage={bytes.average}
      estimate={estimated_usage}
      peak={bytes.peak}
      lastMonthUsage={historical_bytes.average}
      lastMonthEstimate={estimated_usage}
      lastMonthPeak={historical_bytes.peak} />
  )
}

StorageChartContainer.displayName = 'StorageChartContainers'

StorageChartContainer.propTypes = {
  entity: PropTypes.object,
  entityMetrics: PropTypes.object
}

const stateToProps = (state, { id, params: { group } }) => {
  const reduxId = buildReduxId(group, id)
  return {
    entity: getStorageById(state, reduxId).toJS(),
    entityMetrics: getStorageMetrics(state, reduxId)
  }
}

export default connect(stateToProps)(StorageChartContainer)
