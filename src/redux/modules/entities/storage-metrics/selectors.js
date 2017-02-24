import { getEntityById } from '../../entity/selectors'

export const getById = (state, id) => getEntityById(state, 'storageMetrics', id)
