import { getById as getStorageEntity, getAggregatedEstimatesByAccount } from '../../redux/modules/entities/CIS-ingest-points/selectors'
import { getByAccountId as getMetricsByAccount } from '../../redux/modules/entities/storage-metrics/selectors'

/**
 * Default selector for storage entity if it's not passed as prop.
 * @param  {[type]} state       [description]
 * @param  {[type]} storageId   id of storage for which to get data.
 * @return {[type]}             metrics data/entity data for a single storage
 */
export const getStorageById = (state, { storageId }) => getStorageEntity(state, storageId)

export const getStorageEstimateByAccount = (state, { params: { account } }) => {
  return getAggregatedEstimatesByAccount(state, account)
}

export const getStorageMetricsByAccount = (state, { params: { account } }) => {
  return getMetricsByAccount(state, account)
}
