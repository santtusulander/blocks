import { getById as getStorageById, getAggregatedEstimatesByAccount } from '../../redux/modules/entities/CIS-ingest-points/selectors'
import { getAggregatedBytesByAccountId, getByStorageId as getStorageMetrics } from '../../redux/modules/entities/storage-metrics/selectors'

/**
 * Default selectors for metrics and storage entity if they dont get passed as prop.
 * TODO: return metrics by actual storage id when API returns usable data
 * @param  {[type]} state       [description]
 * @param  {[type]} storageId   id of storage for which to get data.
 * @return {[type]}             metrics data/entity data for a single storage
 */
export const defaultStorageMetricsSelector = (state, { /*storageId*/ }) => getStorageMetrics(state, '268-10')
export const defaultStorageSelector = (state, { storageId }) => getStorageById(state, storageId)

/**
 * selectors that accept an entire props-object and pass only the needed data to a store selector
 * @param  {[type]} state
 * @param  {[type]} params   URL params
 * @return {[Immutable Map]} Aggregated byte/estimate data of all storages in an account
 */
export const getStorageMetricsByAccount = (state, { params: { /*account*/ } }) => {
  return getAggregatedBytesByAccountId(state, 20005)
}

export const getStorageEstimateByAccount = (state, { params: { account } }) => {
  return getAggregatedEstimatesByAccount(state, account)

}
