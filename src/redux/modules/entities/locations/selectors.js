// import * as entitySelectors from '../../entity/selectors'

// export const getByBrand = state => brandId => entitySelectors.getEntitiesByParent(state, 'locations', brandId, 'brand_id')
// export const getByAccount = state => accountId => entitySelectors.getEntitiesByParent(state, 'locations', accountId, 'account_id')
// export const getByGroup = state => groupId => entitySelectors.getEntitiesByParent(state, 'locations', groupId, 'group_id')
// export const getById = state => id => entitySelectors.getEntityById(state, 'locations', id)

import {getEntityById, getEntitiesByParent} from '../../entity/selectors'

/**
* Get Location by ID
* @param {} state from redux
* @param String id of the item
* @return {} property
*/
export const getById = (state, id) => {
  return getEntityById(state, 'locations', id)
}

/**
* Get Locations by Group
* @param {} state
* @param {String} brand [description]
* @return List
*/
export const getByGroup = (state, groupId) => {
  return getEntitiesByParent(state, 'locations', groupId, 'id')
}
