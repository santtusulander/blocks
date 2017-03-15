import {getEntityById, getEntitiesByParent, getEntityIdsByParent} from '../../entity/selectors'

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
 * Get Groups by Account
 * @param  {} state
 * @param  {String} account [description]
 * @return List
 */
export const getByAccount = (state, account) => {
  return getEntitiesByParent(state, 'groups', account)
}

/**
 * Get Group IDs by Account
 * @param  {} state
 * @param  {String} account [description]
 * @return List
 */
export const getIdsByAccount = (state, account) => {
  return getEntityIdsByParent(state, 'groups', account)
}
