import {getEntityById, getEntitiesByParent} from '../../entity/selectors'

/**
 * Get Network by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  return getEntityById(state, 'networks', id)
}

/**
 * Get Networks By Group
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getByGroup = (state, groupId) => {
  return getEntitiesByParent(state, 'networks', groupId)
}
