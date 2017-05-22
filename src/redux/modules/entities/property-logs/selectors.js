import {getEntityById, getEntitiesByParent} from '../../entity/selectors'

/**
 * Get Poperty Logs Config by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  return getEntityById(state, 'popertyLogsConfig', id)
}
