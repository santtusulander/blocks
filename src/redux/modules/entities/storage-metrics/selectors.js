import { getEntityById } from '../../entity/selectors'
import { getById, getAggregatedEstimatesByGroup, getAggregatedEstimatesByAccount } from '../CIS-ingest-points/selectors'
import { buildReduxId } from '../../../util'

const getMetricsByEntityId = (state, entityId, entityIdKey, metricsKey = 'data') => {
  const metricsArray = getEntityById(state, 'storageMetrics', metricsKey)

  if (metricsArray) {
    return metricsArray.find(entityMetrics => String(entityMetrics.get(entityIdKey)) === String(entityId))
  }
}

export const getByStorageId = (state, storageId, metricsKey) => {
  return getMetricsByEntityId(state, storageId, 'ingest_point', metricsKey)
}

export const getByGroupId = (state, groupId, metricsKey) => {
  return getMetricsByEntityId(state, groupId, 'group', metricsKey)
}

export const getByAccountId = (state, accountId, metricsKey) => {
  return getMetricsByEntityId(state, accountId, 'account', metricsKey)
}

export const getDataForStorageAnalysisChart = (state, { account, group, storage }, storageType, metricsKey) => {
  let getStorageByParent, getAggregatedEstimates, dataForChart

  if (storage) {
    getStorageByParent = getByStorageId(state, storage, metricsKey)
    getAggregatedEstimates = getById(state, buildReduxId(group, storage), metricsKey)
      ? getById(state, buildReduxId(group, storage)).get('estimated_usage')
      : null
  } else if (group) {
    getStorageByParent = getByGroupId(state, group, metricsKey)
    getAggregatedEstimates = getAggregatedEstimatesByGroup(state, group).get('estimated_usage')
  } else {
    getStorageByParent = getByAccountId(state, account, metricsKey)
    getAggregatedEstimates = getAggregatedEstimatesByAccount(state, account).get('estimated_usage')
  }

  dataForChart =  getStorageByParent && getStorageByParent.get('detail')

  if (dataForChart && storageType === 'bytes') {
    dataForChart = dataForChart.map((storageDetails) => storageDetails.set('estimate', getAggregatedEstimates))
  }

  return dataForChart
}
