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
 * @param  {[string]}         requestCategory
 * @return {[boolean]}        is fetching or not
 */
export const getFetchingByCategory = ({ entities }, requestCategory) => {
  return entities.fetching.some(fetchingGroup => fetchingGroup.get('requestCategory') === requestCategory)
}
