import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'

import { buildReduxId } from '../../redux/util'

import { makeMemoizedSelector } from '../../redux/memoized-selector-utils.js'

import { getStorageById, getStorageMetricsById } from './selectors'

import StorageItemList from '../../components/content/storage/storage-item-list'

const StorageChartContainer = props => {

  const { ingest_point_id, estimated_usage } = props.storageEntity.toJS()
  const { totals: { bytes, historical_bytes } } = props.storageMetrics.toJS()

  return (
      <StorageItemList
        analyticsLink={props.analyticsLink}
        onConfigurationClick={props.onConfigurationClick && (() => props.onConfigurationClick(ingest_point_id))}
        storageContentLink={props.storageContentLink}
        name={ingest_point_id}
        locations={List()}
        currentUsage={bytes.ending}
        estimate={estimated_usage}
        peak={bytes.peak}
        lastMonthUsage={historical_bytes.ending}
        lastMonthEstimate={estimated_usage}
        lastMonthPeak={historical_bytes.peak} />
  )
}

StorageChartContainer.displayName = 'StorageChartContainer'

StorageChartContainer.propTypes = {
  analyticsLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  // clusters: PropTypes.instanceOf(List),
  onConfigurationClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  storageContentLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  storageEntity: PropTypes.instanceOf(Map),
  storageMetrics: PropTypes.instanceOf(Map)
}

StorageChartContainer.defaultProps = {
  storageMetrics: Map({ totals: { bytes: {}, historical_bytes: {} } }),
  storageEntity: Map()
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
      metricsSelector = getStorageMetricsById
    } = ownProps

    const storageReduxId = ownProps.storageId && buildReduxId(ownProps.params.group, ownProps.storageId)

    return {
      storageEntity: getStorageEntity(state, {storageReduxId, ...ownProps}, entitySelector),
      storageMetrics: getMetrics(state, ownProps, metricsSelector)
    }
  }

  return stateToProps
}

export default connect(makeStateToProps)(StorageChartContainer)
