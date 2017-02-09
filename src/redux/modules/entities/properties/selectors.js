import {getEntityById, getEntitiesByParent} from '../../entity/selectors'

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
