import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'

import { makeGetMetrics } from '../../redux/modules/entities/storage-metrics/selectors'

import { defaultStorageSelector, defaultStorageMetricsSelector } from './selectors'

import StorageItemChart from '../../components/content/storage-item-chart'

const StorageChartContainer = props => {

  const { clusters = [], ingest_point_id, estimated_usage } = props.entity.toJS()
  const { bytes, historical_bytes = {} } = props.entityMetrics.toJS()
  return (
      <StorageItemChart
        analyticsLink={/*TODO: UDNP-2932*/'#'}
        configurationLink={/*TODO: UDNP-2932*/'#'}
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
  entityMetrics: PropTypes.object
}

/**
 * Make an own mapStateToProps for every instance of this component.
 * See https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
 * @return {[function]} mapStateToProps
 */
const makeStateToProps = () => {

  const getMetrics = makeGetMetrics()

  const stateToProps = (state, ownProps) => {

    const {
      entitySelector = defaultStorageSelector,
      metricsSelector = defaultStorageMetricsSelector
    } = ownProps

    return {
      entity: entitySelector(state, ownProps) || Map(),
      entityMetrics: getMetrics(state, ownProps, metricsSelector) || Map()
    }
  }

  return stateToProps
}

export default connect(makeStateToProps)(StorageChartContainer)
