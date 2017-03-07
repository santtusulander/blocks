import { getEntityMetricsById, getEntityMetricsByParent } from '../../entity/selectors'

export const getByStorageId = (state, storageId, comparison) => getEntityMetricsById(state, 'storageMetrics', storageId, comparison)
export const getByGroupId = (state, parentId, comparison) => getEntityMetricsByParent(state, 'storageMetrics', parentId, 'group', comparison)
export const getByAccountId = (state, parentId, comparison) => getEntityMetricsByParent(state, 'storageMetrics', parentId, 'account', comparison)
