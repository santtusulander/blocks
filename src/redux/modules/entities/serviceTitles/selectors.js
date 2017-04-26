import {getEntityById} from '../../entity/selectors'

/**
 * Get serviceTitle by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'serviceTitles', id)
}

/**
 * Get list of serviceTitles
 * @param  {} state
 * @param  {String} brand [description]
 * @return Map
 */
export const getAll = (state) => {
  return state.entities.serviceTitles
}
