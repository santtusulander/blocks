import {getEntityById, getEntitiesByParent} from '../../entity/selectors'
import {getMetricsByBrand} from '../../metrics'
import { Map } from 'immutable'

/**
 * Get property by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  return getEntityById(state, 'accounts', id)
}

/**
 * Get Accounts By Brand
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getByBrand = (state, brand) => {
  return getEntitiesByParent(state, 'accounts', brand)
}

/**
 * getByBrandWithMetrics
 * @param  {} state [description]
 * @param  {String} brand
 * @return {List}
 */
export const getByBrandWithMetrics = (state, brand) => {
  const accounts = getByBrand(state, brand)
  const metrics =  getMetricsByBrand(state, brand)

  return accounts.map(account => {
    const accountMetrics = getMetricsByAccount(metrics, account.get('id')) || Map()
    const totalTraffic = accountMetrics.get('totalTraffic') || 0

    return Map({
      ...account.toJS(),
      totalTraffic,
      metrics: accountMetrics

    })
  })
}

/**
 * Helper to find metric for an account
 * @param  {[type]} metrics   [description]
 * @param  {[type]} accountId [description]
 * @return {[type]}           [description]
 */
const getMetricsByAccount = (metrics, accountId) => {
  return metrics.find(metric => metric.get('account') === accountId)
}
