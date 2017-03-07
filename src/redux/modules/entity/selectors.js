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
 * get a group of entities' metrics data
 * @param  {[type]} state                    [description]
 * @param  {[type]} entityType               [description]
 * @param  {[type]} parentId                 [description]
 * @param  {[type]} comparison               if getting comparison metrics
 * @param  {String} [parentIdKey='parentId'] [description]
 * @return {[type]}                          [description]
 */
export const getEntityMetricsByParent = ( state, entityType, parentId, parentIdKey = 'parentId', comparison) => {
  const metricsObject = comparison ? 'comparisonData' : 'data'

  const result = state.entities[entityType].get(metricsObject)

    .filter( entity => { return String(entity.get(parentIdKey)) === String(parentId) } ).toList()

  return result;
}

/**
 * Get an entity's metrics data from state by Id
 * @param  {[type]} state      [description]
 * @param  {[type]} entityType [description]
 * @param  {[type]} id         [description]
 * @param  {[type]} comparison if getting comparison metrics
 * @return {[type]}            [description]
 */
export const getEntityMetricsById = (state, entityType, id, comparison) => {
  const metricsObject = comparison ? 'comparisonData' : 'data'

  return state.entities[entityType].getIn([metricsObject, String(id)])
}
