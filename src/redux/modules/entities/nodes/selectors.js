export const getByParent = ({ entities: { nodes } }, parentId, parentIdKey) => nodes.filter(node => node.get(parentIdKey) === parentId)

export const getByBrand = (state, brandId) => getByParent(state, brandId, 'brand_id')

export const getByAccount = (state, accountId) => getByParent(state, accountId, 'account_id')

export const getByGroup = (state, groupId) => getByParent(state, groupId, 'group_id')
