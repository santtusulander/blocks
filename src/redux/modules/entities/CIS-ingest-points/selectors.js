import {getEntityById, getEntitiesByParent, getEntityIdsByParent} from '../../entity/selectors'

/**
 * Get IngestPoint by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'CISIngestPoints', id)
}

/**
 * Get IngestPoint By Group
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getByGroup = (state, groupId) => {
  return getEntitiesByParent(state, 'CISIngestPoints', groupId)
}

/**
 * Get IngestPoint IDs by Group
 * @param  {[type]} state   [description]
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
export const getIdsByGroup = (state, groupId) => {
  return getEntityIdsByParent(state, 'CISIngestPoints', groupId)
}
