import { getEntityMetricsById } from '../../entity/selectors'
import { getById, getAggregatedEstimatesByGroup, getAggregatedEstimatesByAccount } from '../CIS-ingest-points/selectors'
import { buildReduxId } from '../../../util'

export const getByStorageId = (state, storageId) => {
  return getEntityMetricsById(state, 'storageMetrics', storageId, 'ingest_point')
}

export const getByGroupId = (state, groupId) => {
  return getEntityMetricsById(state, 'storageMetrics', groupId, 'group')
}

export const getByAccountId = (state, accountId) => {
  return getEntityMetricsById(state, 'storageMetrics', accountId, 'account')
}

export const getDataForStorageAnalysisChart = (state, { account, group, storage }, storageType) => {
  let getStorageByParent, getAggregatedEstimates, dataForChart

  if (storage) {
    getStorageByParent = getByStorageId(state, storage)
    getAggregatedEstimates = getById(state, buildReduxId(group, storage))
      ? getById(state, buildReduxId(group, storage)).get('estimated_usage')
      : null
  } else if (group) {
    getStorageByParent = getByGroupId(state, group)
    getAggregatedEstimates = getAggregatedEstimatesByGroup(state, group).get('estimated_usage')
  } else {
    getStorageByParent = getByAccountId(state, account)
    getAggregatedEstimates = getAggregatedEstimatesByAccount(state, account).get('estimated_usage')
  }

  dataForChart =  getStorageByParent && getStorageByParent.get('detail')

  if (dataForChart && storageType === 'bytes') {
    dataForChart = dataForChart.map((storageDetails) => storageDetails.set('estimate', getAggregatedEstimates))
  }

  return dataForChart
}
