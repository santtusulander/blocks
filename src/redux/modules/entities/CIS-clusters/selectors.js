import {getEntityById} from '../../entity/selectors'

/**
 * Get Cluster by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'CISClusters', id)
}

/**
 * Get list of Clusters
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getAll = (state) => {
  return state.entities.CISClusters.toList()
}
