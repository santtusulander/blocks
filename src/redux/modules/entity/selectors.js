/**
 * Get entity from state by Id
 * @param id
 * @param state
 * @returns {*}
 */
export const getEntityById = ( state, entityType, id) => {
  return state.entities.entities[entityType].get(String(id))
}

/**
 * Get group of entities by parent
 * @param parentId
 * @param entityState
 * @param parentState
 * @returns {*}
 */
export const getEntitiesByParent = ( state, entityType, parentId) => {
  const result = state.entities.entities[entityType].filter( entity => { return String(entity.get('parentId')) === String(parentId) } ).toList()

  return result;
}
