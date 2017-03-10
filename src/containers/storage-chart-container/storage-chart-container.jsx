import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'

import { makeMemoizedSelector } from '../../redux/memoized-selector-utils.js'

import { defaultStorageSelector, defaultStorageMetricsSelector } from './selectors'

import AggregatedStorageChart from './aggregated-storage-chart'
import StorageItemChart from '../../components/content/storage-item-chart'

const StorageChartContainer = props => {

  const { clusters = [], ingest_point_id, estimated_usage } = props.entity.toJS()
  const { totals: { bytes, historical_bytes } } = props.entityMetrics.toJS()

  return props.showingAggregate
    ? <AggregatedStorageChart bytes={bytes} estimate={estimated_usage} />
    : (
      <StorageItemChart
        analyticsLink={/*TODO: UDNP-2932*/'#'}
        configurationLink={/*TODO: UDNP-2932*/'#'}
        storageContentLink={/*TODO: UDNP-2925*/'#'}
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
  entity: PropTypes.instanceOf(Map),
  entityMetrics: PropTypes.instanceOf(Map),
  showingAggregate: PropTypes.bool
}

StorageChartContainer.defaultProps = {
  entity: Map(),
  entityMetrics: Map({ totals: { bytes: {}, historical_bytes: {} } })
}

/**
 * Make an own mapStateToProps for every instance of this component.
 * See https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
 * @return {[function]} mapStateToProps
 */
const makeStateToProps = () => {

  const getMetrics = makeMemoizedSelector()
  const getEntity = makeMemoizedSelector()

  const stateToProps = (state, ownProps) => {

    const {
      entitySelector = defaultStorageSelector,
      metricsSelector = defaultStorageMetricsSelector
    } = ownProps

    return {
      entity: getEntity(state, ownProps, entitySelector),
      entityMetrics: getMetrics(state, ownProps, metricsSelector)
    }
  }

  return stateToProps
}

export default connect(makeStateToProps)(StorageChartContainer)
