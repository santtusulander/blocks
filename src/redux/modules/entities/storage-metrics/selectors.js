import { getEntityMetricsById } from '../../entity/selectors'

//Use preset id until we get better metrics data from the API.
export const getByStorageId = (state, storageId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', storageId, 'ingest_point', comparison)
}

//Use preset id until we get better metrics data from the API.
export const getByGroupId = (state, groupId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', groupId, 'group', comparison)
}

//Use preset id until we get better metrics data from the API.
export const getByAccountId = (state, accountId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', accountId, 'account', comparison)
}
