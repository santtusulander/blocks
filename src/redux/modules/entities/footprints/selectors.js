import * as entitySelectors from '../../entity/selectors'

export const getByAccount = state => accountId => entitySelectors.getEntitiesByParent(state, 'locations', accountId)
export const getById = state => id => entitySelectors.getEntityById(state, 'locations', id)
