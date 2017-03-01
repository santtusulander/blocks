import {getEntityById} from '../../entity/selectors'

/**
 * Get CISWorkflowProfiles by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'CISWorkflowProfiles', id)
}

/**
 * Get list of CISWorkflowProfiles
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getAll = (state) => {
  return state.entities.CISWorkflowProfiles.toList()
}
