/**
 * Get entity from state by Id
 * @param id
 * @param state
 * @returns {*}
 */
export const getEntityById = ( state, entityType, id) => {
  return state.entities[entityType].get(String(id))
}

/**
 * Get group of entities by parent
 * @param parentId
 * @param entityState
 * @param parentState
 * @returns {*}
 */
export const getEntitiesByParent = ( state, entityType, parentId, parentIdKey = 'parentId') => {
  const result = state.entities[entityType].filter( entity => { return String(entity.get(parentIdKey)) === String(parentId) } ).toList()

  return result;
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
