import { getEntityMetricsById } from '../../entity/selectors'

export const getByStorageId = (state, storageId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', storageId, 'ingest_point', comparison)
}

export const getByGroupId = (state, groupId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', groupId, 'group', comparison)
}

export const getByAccountId = (state, accountId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', accountId, 'account', comparison)
}

export const getByGroups = (state) => {
  return state.entities['storageMetrics'].get('groupsData')
}
