import { Map, fromJS } from 'immutable'
import {getEntityById, getEntitiesByParent, getEntityIdsByParent} from '../../entity/selectors'

/**
 * Get an aggregate estimate of all storages beloning to a specified parent entity.
 * @param  {[type]} state     [description]
 * @param  {[type]} parentId  [description]
 * @param  {[type]} parentKey [description]
 * @return {[type]}           [description]
 */
const getAggregatedEstimatesByParent = (state, parentId, parentKey) => {

  return getEntitiesByParent(state, 'CISIngestPoints', parentId, parentKey)

    .reduce((aggregate, ingestPoint) => {

      const pathsToUpdate = [ ['estimated_usage'] ]

      pathsToUpdate.forEach(path => {
        aggregate = aggregate.updateIn(path, (value = 0) => value + ingestPoint.getIn(path))
      })

      return aggregate

    }, Map())
}

/**
 * Get IngestPoint by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'CISIngestPoints', id)
}

/**
 * Get IngestPoint By Group
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getByGroup = (state, groupId) => {
  return getEntitiesByParent(state, 'CISIngestPoints', groupId)
}

/**
 * Get IngestPoint IDs by Group
 * @param  {[type]} state   [description]
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
export const getIdsByGroup = (state, groupId) => {
  return getEntityIdsByParent(state, 'CISIngestPoints', groupId)
}

/**
 * Get IngestPoint IDs By Account
 * @param  {[type]} state     [description]
 * @param  {[type]} accountId [description]
 * @return {[type]}           [description]
 */
export const getIdsByAccount = (state, accountId) => {
  return getEntityIdsByParent(state, 'CISIngestPoints', accountId, 'accountId')
}

/**
 * get an aggregated estimate of all storages in an account
 * @param  {[type]} state     [description]
 * @param  {[type]} accountId [description]
 * @return {[type]}           [description]
 */
export const getAggregatedEstimatesByAccount = (state, accountId) => {
  return getAggregatedEstimatesByParent(state, accountId, 'accountId')
}

/**
 * get an aggregated estimate of all storages in a group
 * @param  {[type]} state   [description]
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
export const getAggregatedEstimatesByGroup = (state, groupId) => {
  return getAggregatedEstimatesByParent(state, groupId)
}

/**
 * Get IngestPoints By Groups
 * @param  {} state
 * @param  {List} list of groups
 * @return List
 */
export const getByGroups = (state, groups) => {
  if (groups && groups.size > 0) {
    let storages = []
    groups.forEach(group => {
      const groupStorages = getByGroup(state, group.get('id'))
      groupStorages.forEach( storage => {
        storages.push(storage)
      })
    })
    return fromJS(storages)
  }
}
