import { List } from 'immutable'
import {getEntityById, getEntitiesByParent} from '../../entity/selectors'

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
 * Get IngestPoints By Groups
 * @param  {} state
 * @param  {List} list of groups
 * @return List
 */
export const getByGroups = (state, groups) => {
  if (groups && groups.size > 0) {
    return groups.reduce((acc, g) => {
      const groupStorages = getByGroup(state, g.get('id'))
      return acc.merge(groupStorages)
    }, List())
  }
}
