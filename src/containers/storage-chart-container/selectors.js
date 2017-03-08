import { Map } from 'immutable'

import { getById as getStorageById } from '../../redux/modules/entities/CIS-ingest-points/selectors'
import { getAggregatedBytesByAccountId } from '../../redux/modules/entities/storage-metrics/selectors'

const mockMetrics = {
  bytes: {
    ending: 108000497044939,
    peak: 71963080986145,
    low: 36037416058794,
    average: 54000248522470,
    percent_change: 50.00
  },
  historical_bytes: {
    ending: 108000497044939,
    peak: 71963080986145,
    low: 36037416058794,
    average: 54000248522470,
    percent_change: 50.00
  }
}

//TODO: replace this with redux selector once storage metrics redux is ready in UDNP-2932
const getStorageMetricsById = () => Map(mockMetrics)

/**
 * Default selectors for metrics and storage entity if neither are passed as prop.
 * @param  {[type]} state       [description]
 * @param  {[type]} storageId   id of storage for which to get data.
 * @return {[type]}             metrics data/entity data for a single storage
 */
export const defaultStorageMetricsSelector = (state, { storageId }) => getStorageMetricsById(state, storageId)
export const defaultStorageSelector = (state, { storageId }) => getStorageById(state, storageId)

/**
 * selector that accepts an entire prop-object and passes only desired data to general selector
 * @param  {[type]} state
 * @param  {[type]} params   URL params
 * @return {[Immutable Map]} Aggregated byte data of all storages in an account
 */
export const getStorageMetricsByAccount = (state, { params: { /*account*/ } }) => {

  return getAggregatedBytesByAccountId(state, 20005)

}
