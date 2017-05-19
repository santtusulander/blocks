import {getEntityById} from '../../entity/selectors'

/**
 * Get Permission by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'roles', id)
}

/**
 * Get list of Roles
 * @param  {} state
 * @param  {String} brand [description]
 * @return Map
 */
export const getAll = (state) => {
  return state.entities.roles
}

/**
 * Get list of allowed roles by roleId
 * @param  {} state [description]
 * @param  {String} roleId
 * @return {List} List of roleIds
 */
export const getAllowedRolesById = (state, id) => {
  return getEntityById(state, 'allowedRoles', id)
}
