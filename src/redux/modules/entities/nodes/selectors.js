import * as entitySelectors from '../../entity/selectors'

export const getByBrand = state => accountId => entitySelectors.getEntitiesByParent(state, 'nodes', accountId, 'brand_id')
export const getByGroup = state => accountId => entitySelectors.getEntitiesByParent(state, 'nodes', accountId, 'group_id')
export const getByAccount = state => accountId => entitySelectors.getEntitiesByParent(state, 'nodes', accountId, 'account_id')
export const getById = state => id => entitySelectors.getEntityById(state, 'nodes', id)
