import {getEntityById} from '../../entity/selectors'

/**
 * Get Logs Config by Poperty ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} config
 */
export const getById = (state, id) => {
  return getEntityById(state, 'propertiesLogsConfig', id)
}
