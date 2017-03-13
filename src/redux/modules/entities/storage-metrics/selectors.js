import { getEntityMetricsById } from '../../entity/selectors'

//Use preset id until we get better metrics data from the API.
export const getByStorageId = (state, storageId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', 'music', 'ingest_point_id', comparison)
}

//Use preset id until we get better metrics data from the API.
export const getByGroupId = (state, groupId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', 340, 'group_id', comparison)
}

//Use preset id until we get better metrics data from the API.
export const getByAccountId = (state, accountId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', 239, 'account_id', comparison)
}
