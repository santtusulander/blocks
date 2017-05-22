import {getEntityById} from '../../entity/selectors'

/**
 * Get publishedUrls by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'publishedUrls', id)
}

/**
 * Get list of publishedUrls
 * @param  {} state
 * @param  {String} brand [description]
 * @return Map
 */
export const getAll = (state) => {
  return state.entities.publishedUrls
}
