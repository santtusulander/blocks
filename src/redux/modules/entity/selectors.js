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
export const getEntitiesByParent = ( parentId, entityState, parentState) => {
  //get array of ids (if found) and call getEntityById
  if ( parentState[parentId] ) {
    return parentState[parentId].map( id => getEntityById( id, entityState ) )
  }

  return undefined
}
