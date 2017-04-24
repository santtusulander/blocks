import {getEntityById, getEntitiesByParent, getEntitiesByPage} from '../../entity/selectors'
/**
 * Get Users by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} metadata
 */
export const getById = (state, id) => {
  return getEntityById(state, 'users', id)
}

export const getByBrand = (state, account) => {
  return getEntitiesByParent(state, 'users', account, 'brand_id')
}

export const getByAccount = (state, account) => {
  return getEntitiesByParent(state, 'users', account, 'account_id')
}

export const getByGroup = (state, group) => {
  return getEntitiesByParent(state, 'users', group, 'group_id')
}


export const getByPage = (state, page) => {
  return getEntitiesByPage(state, 'users', page, 'user')
}
