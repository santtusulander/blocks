import { List, fromJS } from 'immutable'
import {getEntityById, getEntitiesByParent, getEntityIdsByParent} from '../../entity/selectors'
import { getConfiguredName } from '../../../../util/helpers'
/**
 * Get property by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  return getEntityById(state, 'properties', id)
}

/**
 * Get Properties By Group
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getByGroup = (state, group) => {
  return getEntitiesByParent(state, 'properties', group)
}

/**
 * Get Properties By Account
 * @param  {} state
 * @param  {String} account ID
 * @return List
 */
export const getByAccount = (state, account) => {
  const groups = getEntitiesByParent(state, 'groups', account)

  if (groups && groups.size > 0) {
    return groups.reduce((acc, g) => {
      const groupProperties = getByGroup(state, g.get('id'))
      return acc.merge( groupProperties )
    }, List())
  }
}

/**
 * Get Properties By Groups
 * @param  {} state
 * @param  {List} list of groups
 * @return List
 */
export const getByGroups = (state, groups) => {
  if (groups && groups.size > 0) {
    let properties = []
    groups.forEach(group => {
      const groupProperties = getByGroup(state, group.get('id'))
      groupProperties.forEach( property => {
        properties.push(property)
      })
    })
    return fromJS(properties)
  }
}

/**
 * Get Property IDs by Group
 * @param  {[type]} state   [description]
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
export const getIdsByGroup = (state, groupId) => {
  return getEntityIdsByParent(state, 'properties', groupId)
}


/**
 * [getPropertyMetricsById description]
 * @param  {[type]} state      [description]
 * @param  {[type]} propertyId [description]
 * @return {[type]}            [description]
 */
export const getPropertyMetricsById = (state, propertyId) => {

  const entity = getById(state, propertyId)
  const configuredName = getConfiguredName(entity)

  return state.metrics.get('hostMetrics').find( metric => metric.get('property') === configuredName )
}

/**
 * [getByGroupWithTotalTraffic description]
 * @param  {[type]} state [description]
 * @param  {[type]} group [description]
 * @return {[type]}       [description]
 */
export const getByGroupWithTotalTraffic = (state, group) => {
  const properties = getByGroup(state, group)
  const result = properties.map( property => {

    const metrics = getPropertyMetricsById(state, property.get('published_host_id'))
    const totalTraffic = metrics ? metrics.get('totalTraffic') : 0

    return property.set('totalTraffic', totalTraffic)
  })

  return result
}

/**
 * getPropertyDailyTrafficById
 * @param  {Object} redux state
 * @param  {String|Number} propertyId
 * @return {Map} dailyTraffic of a property
 */
export const getPropertyDailyTrafficById = (state, propertyId) => {

  const entity = getById(state, propertyId)
  const configuredName = getConfiguredName(entity)

  return state.metrics.get('hostDailyTraffic').find( metric => metric.get('property') === configuredName )
}

/**
 * getTotalTraffics
 * @param  {Object} state
 * @return {List} List of totalTraffics
 */
export const getTotalTraffics = (state) => {
  return state.metrics.get('hostMetrics').map( property => property.get('totalTraffic') )
}
