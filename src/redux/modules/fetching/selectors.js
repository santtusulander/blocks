/**
 * Check globally if fetching flag is set in any request group except the one for GAS
 * @param state
 * @returns {boolean}
 */
export const getGlobalFetching = ({ entities }, includeAccountSelector) => {
  const pendingRequests = entities.fetching

  return includeAccountSelector
    ? !!pendingRequests.size
    : pendingRequests.some(pendingRequest => pendingRequest.get('requestTag') !== 'GAS-REQUEST')
}

/**
 * Check if a specific request group is fetching
 * @param  {[Immutable Map]}  state
 * @param  {[string]}         requestTag
 * @return {[boolean]}        is fetching or not
 */
export const getFetchingByTag = ({ entities }, requestTag) => {
  return entities.fetching.some(fetchingGroup => fetchingGroup.get('requestTag') === requestTag)
}
