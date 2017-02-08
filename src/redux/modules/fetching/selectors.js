/**
 * Check globally if fetching flag is set in any request group
 * @param state
 * @returns {boolean}
 */
export const getGlobalFetching = ({ entities }) => {
  return !!entities.fetching.size
}

/**
 * Check if a specific request group is fetching
 * @param  {[Immutable Map]}  state
 * @param  {[string]}         requestGroup
 * @return {[boolean]}        is fetching or not
 */
export const getFetchingByGroup = ({ entities }, requestGroup) => {
  return entities.fetching.some(fetchingGroup => fetchingGroup.get('requestGroup') === requestGroup)
}
