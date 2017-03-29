import {getEntityById} from '../../entity/selectors'

/**
 * Get Permission by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'userPermissions', id)
}

/**
 * Get list of Roles
 * @param  {} state
 * @param  {String} brand [description]
 * @return Map
 */
export const getAll = (state) => {
  return state.entities.userPermissions
}
