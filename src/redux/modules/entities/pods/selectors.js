import {getEntityById, getEntitiesByParent} from '../../entity/selectors'

/**
 * Get Pod by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  return getEntityById(state, 'pods', id)
}

/**
 * Get Pods By Pop
 * @param  {} state
 * @param  {String} popId [description]
 * @return List
 */
export const getByPop = (state, popId) => {
  return getEntitiesByParent(state, 'pods', popId)
}
