import * as entitySelectors from '../../entity/selectors'

export const getByBrand = state => brandId => entitySelectors.getEntitiesByParent(state, 'nodes', brandId, 'brand_id')
export const getByAccount = state => accountId => entitySelectors.getEntitiesByParent(state, 'nodes', accountId, 'account_id')
export const getByGroup = state => groupId => entitySelectors.getEntitiesByParent(state, 'nodes', groupId, 'group_id')
export const getById = state => id => entitySelectors.getEntityById(state, 'nodes', id)
