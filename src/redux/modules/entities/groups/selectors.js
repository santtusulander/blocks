import {getFetching} from '../../fetching/selectors'
//import {getEntityById, getEntitiesByParent} from '../../entity/selectors'
//import {flatten} from '../../../../util/helpers'
//const STATEPART = 'accounts'

export const getByAccount = (state, accountId) => {

  const ids = state.entities.entities.accountGroups.getIn([String(accountId), 'groups'])

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
  const prop =  state.entities.entities.groups.get(String(id))
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
