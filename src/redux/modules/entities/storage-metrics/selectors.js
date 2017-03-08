import { fromJS } from 'immutable'

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
