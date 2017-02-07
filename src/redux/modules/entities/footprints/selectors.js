import * as entitySelectors from '../../entity/selectors'

//export const getByAccount = state => accountId => entitySelectors.getEntitiesByParent(state, 'footprints', accountId)
export const getByAccount = state => accountId => entitySelectors.getEntitiesByParent(state, 'footprints', accountId, 'accountId')
export const getById = state => id => entitySelectors.getEntityById(state, 'footprints', id)
