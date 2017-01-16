/**
 * Get entity from state by Id
 * @param id
 * @param state
 * @returns {*}
 */
export const getEntityById = ( id, state) => {
  return state.get(String(id)).toJS()
}

/**
 * Get group of entities by parent
 * @param parentId
 * @param entityState
 * @param parentState
 * @returns {*}
 */
export const getEntitiesByParent = ( state, entityType, parentId) => {
  const result = state.entities.entities[entityType].filter( entity => { return entity.get('parentId') === parentId } ).toList()
  
  return result;
}
