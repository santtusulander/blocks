import { getEntityById, getEntitiesByParent, getEntityIdsByParent } from '../../entity/selectors'
import { getMetricsByAccount } from '../../metrics'
import { Map } from 'immutable'
/**
 * Get property by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  return getEntityById(state, 'groups', id)
}

/**
 * Get Groups by Account
 * @param  {} state
 * @param  {String} account [description]
 * @return List
 */
export const getByAccount = (state, account) => {
  return getEntitiesByParent(state, 'groups', account)
}

/**
 * Get Group IDs by Account
 * @param  {} state
 * @param  {String} account [description]
 * @return List
 */
export const getIdsByAccount = (state, account) => {
  return getEntityIdsByParent(state, 'groups', account)
}

/**
 * getByAccountWithMetrics
 * @param  {} state
 * @param  {String} account (id)
 * @return {List}
 */
export const getByAccountWithMetrics = (state, account) => {
  const groups = getByAccount(state, account)
  const metrics =  getMetricsByAccount(state, account)

  return groups.map(group => {
    const groupMetrics = getMetricsByGroup(metrics, group.get('id')) || Map()
    const totalTraffic = groupMetrics.get('totalTraffic') || 0

    return Map({
      ...group.toJS(),
      totalTraffic,
      metrics: groupMetrics
    })
  })
}

/**
 * Helper for finding metrics for a group
 * @param  {[type]} metrics [description]
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
const getMetricsByGroup = (metrics, groupId) => {
  return metrics.find(metric => metric.get('group') === groupId)
}
