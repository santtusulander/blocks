/**
 * Reducers for Fetching - module
 * @returns {boolean}
 */
export const set = (state, { payload }) => {
  return state.merge(payload)
}

export const clear = (state, { payload }) => {
  const [ requestId ] = Object.keys(payload)
  return state.delete(requestId)
}
