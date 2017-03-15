import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'

import { makeMemoizedSelector } from '../../redux/memoized-selector-utils.js'

import { getStorageById } from './selectors'

import { getByStorageId } from '../../redux/modules/entities/storage-metrics/selectors'

import AggregatedStorageChart from './aggregated-storage-chart'
import StorageItemChart from '../../components/content/storage-item-chart'

const StorageChartContainer = props => {

  const { ingest_point_id, estimated_usage } = props.storageEntity.toJS()
  const { totals: { bytes, historical_bytes } } = props.storageMetrics.toJS()
  const onConfigurationClick = () => {
    props.onConfigurationClick(ingest_point_id)
  }
  return props.showingAggregate
    ? <AggregatedStorageChart bytes={bytes} estimate={estimated_usage} />
    : (
      <StorageItemChart
        analyticsLink={props.analyticsLink}
        onConfigurationClick={props.onConfigurationClick && onConfigurationClick}
        storageContentLink={props.storageContentLink}
        name={ingest_point_id}
        locations={List()}
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
  analyticsLink: PropTypes.string,
  // clusters: PropTypes.instanceOf(List),
  onConfigurationClick: PropTypes.func,
  showingAggregate: PropTypes.bool,
  storageContentLink: PropTypes.string,
  storageEntity: PropTypes.instanceOf(Map),
  storageMetrics: PropTypes.instanceOf(Map)
}

StorageChartContainer.defaultProps = {
  storageMetrics: Map({ totals: { bytes: {}, historical_bytes: {} } })
}

/**
 * Make an own mapStateToProps for every instance of this component.
 * See https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
 * @return {[function]} mapStateToProps
 */
const makeStateToProps = () => {
  const getMetrics = makeMemoizedSelector()
  const getStorageEntity = makeMemoizedSelector()

  const stateToProps = (state, ownProps) => {

    const {
      entitySelector = getStorageById,
      metricsSelector = getByStorageId
    } = ownProps

    const storageEntity = getStorageEntity(state, ownProps, entitySelector) || Map()

    return {
      storageEntity,
      storageMetrics: getMetrics(state, ownProps, metricsSelector)
    }
  }

  return stateToProps
}

export default connect(makeStateToProps)(StorageChartContainer)
