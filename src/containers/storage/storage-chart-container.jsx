import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { is, Map } from 'immutable'

import { getById as getStorageById } from '../../redux/modules/entities/CIS-ingest-points/selectors'

import StorageItemChart from '../../components/content/storage-item-chart'

import { getContentUrl } from '../../util/routes'

const mockMetrics = {
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
}

//TODO: replace this with redux selector once storage metrics redux is ready in UDNP-2932
const getStorageMetricsById = () => Map(mockMetrics)

/**
 * Creator for a memoized selector. TODO: Move this into the storage metrics redux selectors-file when it's done in UDNP-2932
 */
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  is
)

/**
 * Make an own metrics-selector for every instance of this component to cache selector results per instance
 * TODO: Move this into the storage metrics redux selectors-file when it's done in UDNP-2932
 * @return {[function]} a function that when called, returns a memoized selector
 */
const makeGetMetrics = () => createDeepEqualSelector(
  getStorageMetricsById,
  metrics => metrics
)

const StorageChartContainer = props => {
  const { clusters, ingest_point_id, estimated_usage } = props.entity.toJS()
  const { bytes, historical_bytes } = props.entityMetrics.toJS()
  return (
      <StorageItemChart
        analyticsLink={/*TODO: UDNP-2932*/'#'}
        configurationLink={/*TODO: UDNP-2932*/'#'}
        storageContentLink={getContentUrl('storage', props.storageId, props.params)}
        name={ingest_point_id}
        locations={clusters}
        currentUsage={bytes.average}
        estimate={estimated_usage}
        peak={bytes.peak}
        lastMonthUsage={historical_bytes.average}
        lastMonthEstimate={estimated_usage}
        lastMonthPeak={historical_bytes.peak} />
  )
}

StorageChartContainer.displayName = 'StorageChartContainer'

StorageChartContainer.propTypes = {
  entity: PropTypes.object,
  entityMetrics: PropTypes.object,
  params: PropTypes.object,
  storageId: PropTypes.string
}

/**
 * Make an own mapStateToProps for every instance of this component.
 * See https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
 * @return {[function]} mapStateToProps
 */
const makeStateToProps = () => {

  const getMetrics = makeGetMetrics()

  const stateToProps = (state, { storageId }) => {

    return {
      entity: getStorageById(state, storageId),
      entityMetrics: getMetrics()
    }
  }

  return stateToProps
}

export default connect(makeStateToProps)(StorageChartContainer)
