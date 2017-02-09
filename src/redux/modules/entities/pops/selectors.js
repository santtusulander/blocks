import {getEntityById, getEntitiesByParent} from '../../entity/selectors'

/**
 * Get POP by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  return getEntityById(state, 'pops', id)
}

/**
 * Get POPs By Network
 * @param  {} state
 * @param  {String} networkId [description]
 * @return List
 */
export const getByNetwork = (state, networkId) => {
  return getEntitiesByParent(state, 'pops', networkId)
}
