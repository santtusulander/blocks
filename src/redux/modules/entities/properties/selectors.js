import {getFetching} from '../../fetching/selectors'
//import {getEntityById, getEntitiesByParent} from '../../entity/selectors'
import {flatten} from '../../../../util/helpers'
const STATEPART = 'properties'

/**
 * Get all host IDs (keys from state)
 * @param  {} state root
 * @return [] Array of Ids
 */
export const getAllHosts = (state) => {
  console.warn('Deprecated -- use getProperties instead');

  const ids = []
  state.entities.entities[STATEPART].forEach( (val, key) => ids.push(key) )
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

  return props && props
}

export const getByAccount = (state, accountId) => {
  const groups = state.entities.entities.accountGroups.getIn([String(accountId), 'groups'])

  return groups && flatten(groups.reduce ( (result, groupId) => {
    const groupProperties = getByGroup(state, groupId)

    if (groupProperties) return result.concat( groupProperties )

    return result;
  }, []))
}

export const getByGroup = (state, groupId) => {

  const ids = state.entities.entities.groupProperties.getIn([String(groupId), 'properties'])

  return ids && ids.reduce( (result, id) => {
    const res = getById(state, id)
    if (res) return result.concat(res.toJS())

    return result
  }, [])
}

/**
 * Get property by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  const prop =  state.entities.entities.properties.get(String(id))
  if (prop) return prop

  return null
}

/**
 * isFetching ?
 * @param  {}  state
 * @return Boolean
 */
export const isFetching = (state) => {
  return getFetching(state.entities.fetching)
}
