import {getEntityById} from '../../entity/selectors'

/**
 * Get Role Name by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'roleNames', id)
}

/**
 * Get list of Role names
 * @param  {} state
 * @return Map
 */
export const getAll = (state) => {
  return state.entities.roleNames.toList()
}
