import {getEntityById, getEntitiesByParent} from '../../entity/selectors'

/**
 * Get property by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  return getEntityById(state, 'groups', id)
}

/**
 * Get Accounts By Brand
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getByAccount = (state, account) => {
  return getEntitiesByParent(state, 'groups', account)
}
