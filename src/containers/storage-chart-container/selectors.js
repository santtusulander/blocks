import { List, Map } from 'immutable'

import { getById as getStorageEntity, getAggregatedEstimatesByAccount } from '../../redux/modules/entities/CIS-ingest-points/selectors'
import { getByAccountId as getMetricsByAccount } from '../../redux/modules/entities/storage-metrics/selectors'
import { getById as getClusterById } from '../../redux/modules/entities/CIS-clusters/selectors'

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

export const getClusterNames = (state, clusterIds = List()) => {

  return clusterIds.map(id => {
    return ( getClusterById(state, id) || Map() ).get('description')
  })

}
