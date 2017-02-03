import * as entitySelectors from '../../entity/selectors'

export const getByBrand = state => brandId => entitySelectors.getEntitiesByParent(state, 'locations', brandId, 'brand_id')
export const getByAccount = state => accountId => entitySelectors.getEntitiesByParent(state, 'locations', accountId, 'account_id')
export const getByGroup = state => groupId => entitySelectors.getEntitiesByParent(state, 'locations', groupId, 'group_id')
export const getById = state => id => entitySelectors.getEntityById(state, 'locations', id)
