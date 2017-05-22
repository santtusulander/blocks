import { getEntityById } from '../../entity/selectors'

/**
 * Get IngestPointContents by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'CISIngestPointContents', id)
}
