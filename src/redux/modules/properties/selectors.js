import {getFetching} from '../fetching/selectors'

/**
 * Get all host IDs (keys from state)
 * @param  {} state root
 * @return [] Array of Ids
 */
export const getAllHosts = (state) => {
  return state.properties.properties.map( (val, key) => key)
}

/**
 * Get properties fro state
 * @param  {} state
 * @return [] Array of property objects
 */
export const getProperties = (state) => {
  return state.properties.properties.toJS();
}

/**
 * isFetching ?
 * @param  {[type]}  state [description]
 * @return {Boolean}       [description]
 */
export const isFetching = (state) => {
  return getFetching(state.properties.fetching)
}
