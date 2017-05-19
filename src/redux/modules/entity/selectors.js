import { List } from 'immutable'

/**
 * Get entity from state by Id
 * @param id
 * @param state
 * @returns {*}
 */
export const getEntityById = (state, entityType, id) => {
  return state.entities[entityType].get(String(id))
}

/**
 * Get group of entities by parent
 * @param parentId
 * @param entityState
 * @param parentState
 * @returns {*}
 */
export const getEntitiesByParent = (state, entityType, parentId, parentIdKey = 'parentId') => {
  const result = state.entities[entityType].filter(entity => {
    return String(entity.get(parentIdKey)) === String(parentId)
  }).toList()

  return result;
}

export const getEntitiesByPage = (state, entityType, page, entityPaginationType) => {
  if (!entityPaginationType) {
    entityPaginationType = entityType
  }

  const ids = state.entities.entityPagination.getIn([entityPaginationType, String(page)])

  //Need to use .reduce instead of map as getEntityById might return undefined (in case user was deleted etc) and
  //using .map inserts also 'undefined' values in List
  return ids && ids.reduce((mem, id) => {
    const val = getEntityById(state, entityType,id)
    if (val) {
      mem = mem.push(val)
    }

    return mem
  }, List())
}

export const getPaginationMeta = (state, entityPaginationType) => {
  return state.entities.entityPagination.getIn([entityPaginationType, 'meta'])
}

/**
 * Get entity keys by parent id
 * @param  {[type]} state
 * @param  {[type]} entityType
 * @param  {[type]} parentId
 * @param  {String} parentIdKey
 * @return {[array]}
 */
export const getEntityIdsByParent = (state, entityType, parentId, parentIdKey = 'parentId') => {
  return state.entities[entityType].filter((entity) => String(entity.get(parentIdKey)) === String(parentId))
    .keySeq()
}

/**
 * Get an entity's metrics from state
 * @param  {[type]} state      [description]
 * @param  {[type]} entityType [description]
 * @param  {[type]} comparison [description]
 * @return {[type]}            [description]
 */
export const getEntityMetricsById = (state, entityType, id, idKey = 'id', comparison) => {
  const metricsObject = comparison ? 'comparisonData' : 'data'
  return state.entities[entityType].get(metricsObject).find(entityMetrics => String(entityMetrics.get(idKey)) === String(id))
}
