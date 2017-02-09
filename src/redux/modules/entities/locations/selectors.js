import * as entitySelectors from '../../entity/selectors'

/**
* Get Locations by Brand
* @param {} state
* @param {String} brand [description]
* @return List
*/
export const getByBrand = (state, brandId) => entitySelectors.getEntitiesByParent(state, 'locations', brandId, 'brandd')

/**
* Get Locations by Account
* @param {} state
* @param {String} account [description]
* @return List
*/
export const getByAccount = (state, accountId) => entitySelectors.getEntitiesByParent(state, 'locations', accountId, 'accountId')

/**
* Get Locations by Group
* @param {} state
* @param {String} group [description]
* @return List
*/
export const getByGroup = (state, groupId) => entitySelectors.getEntitiesByParent(state, 'locations', groupId, 'groupId')

/**
* Get Location by ID
* @param {} state from redux
* @param String id of the item
* @return {} property
*/
export const getById = (state, id) => entitySelectors.getEntityById(state, 'locations', id)
