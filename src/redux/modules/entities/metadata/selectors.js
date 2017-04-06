import {getEntityById} from '../../entity/selectors'
/**
 * Get metadata by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} metadata
 */
export const getById = (state, id) => {
  return getEntityById(state, 'propertyMetadata', id)
}
