import * as entitySelectors from '../../entity/selectors'

export const getByBrand = state => brandId => entitySelectors.getEntitiesByParent(state, 'nodes', brandId, 'brand_id')
export const getByAccount = state => accountId => entitySelectors.getEntitiesByParent(state, 'nodes', accountId, 'account_id')
export const getByGroup = state => groupId => entitySelectors.getEntitiesByParent(state, 'nodes', groupId, 'group_id')
export const getByPod = (state, podId) => entitySelectors.getEntitiesByParent(state, 'nodes', podId)

export const getById = state => id => {
  const node = entitySelectors.getEntityById(state, 'nodes', id)
  return node && node.toJS()
}
