import {getFetching} from '../../fetching/selectors'

/**
 * Get property by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  const prop =  state.entities.accounts.get(String(id))
  if (prop) return prop

  return null
}

export const getByBrand = (state, brand) => {
  return state.accounts.filter( account => account.brand === brand )
}

/**
 * isFetching ?
 * @param  {}  state
 * @return Boolean
 */
export const isFetching = (state) => {
  return getFetching(state.entities.fetching)
}
