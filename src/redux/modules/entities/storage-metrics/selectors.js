import { getEntityById } from '../../entity/selectors'

export const getByStorageId = (state, storageId) => getEntityById(state, 'storageMetrics', storageId)
export const getByParentId = (state, parentId, parentIdKey = 'group') => getEntityById(state, 'storageMetrics', parentId, parentIdKey)
