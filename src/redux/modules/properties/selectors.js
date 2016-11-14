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
export const getProperties = (state, brandId, accountId, groupId) => {
  let props

  if (groupId) props = getByGroup(state, groupId)
  else if (accountId) props = getByAccount(state, accountId)
  else props = state.properties.properties


  return props && props.toJS()
}

export const getByAccount = (state, accountId) => {
  return state.properties.properties.filter( prop => prop.get('accountId') === accountId)
}

export const getByGroup = (state, groupId) => {
  return state.properties.properties.filter( prop => prop.get('groupId') === groupId)
}


/**
 * isFetching ?
 * @param  {[type]}  state [description]
 * @return {Boolean}       [description]
 */
export const isFetching = (state) => {
  return getFetching(state.properties.fetching)
}
