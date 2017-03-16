import { getEntityMetricsById } from '../../entity/selectors'
import { getById, getAggregatedEstimatesByGroup, getAggregatedEstimatesByAccount } from '../CIS-ingest-points/selectors'
import { buildReduxId } from '../../../util'

export const getByStorageId = (state, storageId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', storageId, 'ingest_point', comparison)
}

export const getByGroupId = (state, groupId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', groupId, 'group', comparison)
}

export const getByAccountId = (state, accountId, comparison) => {
  return getEntityMetricsById(state, 'storageMetrics', accountId, 'account', comparison)
}

export const getDataForChart = (state, { account, group, storage }, storageType, comparison) => {
  let getStorageByParent, getAggregatedEstimates, dataForChart

  if(storage) {
    getStorageByParent = getByStorageId(state, storage, comparison)
    getAggregatedEstimates = getById(state, buildReduxId(group, storage))
      ? getById(state, buildReduxId(group, storage)).get('estimated_usage')
      : null
  } else if(group) {
    getStorageByParent = getByGroupId(state, group, comparison)
    getAggregatedEstimates = getAggregatedEstimatesByGroup(state, group).get('estimated_usage')
  } else {
    getStorageByParent = getByAccountId(state, account, comparison)
    getAggregatedEstimates = getAggregatedEstimatesByAccount(state, account).get('estimated_usage')
  }

  dataForChart =  getStorageByParent && getStorageByParent.get('detail')

  if(dataForChart && storageType === 'bytes') {
    dataForChart = dataForChart.map((storageDetails) => storageDetails.set('estimate', getAggregatedEstimates))
  }

  return dataForChart
}

export const getByGroups = (state) => {
  return state.entities['storageMetrics'].get('groupsData')
}
