/**
 * Get all host IDs (keys from state)
 * @param  {} state root
 * @return Array of Ids
 */
export const getHostIds = (state) => {
  return state.properties.properties.map( (val, key) => key)
}

/**
 * [isFetching description]
 * @param  {[type]}  state [description]
 * @return {Boolean}       [description]
 */
export const isFetching = (state) => {
  return getFetching(state.properties.fetching)
}
