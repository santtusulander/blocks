import { fromJS, is } from 'immutable'
import { createSelectorCreator, defaultMemoize } from 'reselect'

import { getEntityMetricsById, getEntityMetricsByParent } from '../../entity/selectors'

const aggregateBytesByParent = (state, parentId, parentKey, comparison) => {

  return getEntityMetricsByParent(state, 'storageMetrics', parentId, parentKey, comparison)

    .reduce((aggregate, storageMetrics) => {

      const pathsToUpdate = [ ['totals', 'bytes', 'average'], ['totals', 'bytes', 'peak'], ['totals', 'bytes', 'low'] ]

      pathsToUpdate.forEach(path => {
        aggregate = aggregate.updateIn(path, (value = 0) => value + storageMetrics.getIn(path))
      })

      return aggregate

    }, fromJS({ totals: { bytes: {} } })).get('totals')
}

export const getByStorageId = (state, storageId, comparison) => getEntityMetricsById(state, 'storageMetrics', storageId, comparison)

export const getByGroupId = (state, parentId, comparison) => getEntityMetricsByParent(state, 'storageMetrics', parentId, 'group', comparison)

export const getByAccountId = (state, parentId, comparison) => getEntityMetricsByParent(state, 'storageMetrics', parentId, 'account', comparison)

export const getAggregatedBytesByAccountId = (state, parentId, comparison) => aggregateBytesByParent(state, parentId, 'account', comparison)

/**
 * Creator for a memoized selector, using immutable.is as an equality check.
 */
export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  is
)

/**
 * Make an own metrics-selector for every instance of this component to cache selector results per instance
 * @return {[function]} a function that when called, returns a memoized selector
 */
export const makeGetMetrics = () => createDeepEqualSelector(
  (state, props, metricsSelector) => {
    return metricsSelector(state, props)
  },
  metrics => metrics
)
