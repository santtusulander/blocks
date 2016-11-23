import {getFetching} from '../fetching/selectors'

/**
 * Get all host IDs (keys from state)
 * @param  {} state root
 * @return [] Array of Ids
 */
export const getAllHosts = (state) => {
  const ids = []
  state.properties.properties.forEach( (val, key) => ids.push(key) )
  return ids
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


  return props && props
}

export const getByAccount = (state, accountId) => {
  return state.properties.properties.filter( prop => prop.get('accountId') === accountId)
}

export const getByGroup = (state, groupId) => {
  return state.properties.properties.filter( prop => prop.get('groupId') === groupId)
}

/**
 * Get property by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  const property = state.properties.properties.get(id)

  if (property) {
    return property
      /* Delete added keys to provide compatibility with old code
      should replace with relations for brand/account/group
      */
      .delete('brandId')
      .delete('accountId')
      .delete('groupId')
      
  }

  return null
}

/**
 * isFetching ?
 * @param  {}  state
 * @return Boolean
 */
export const isFetching = (state) => {
  return getFetching(state.properties.fetching)
}
