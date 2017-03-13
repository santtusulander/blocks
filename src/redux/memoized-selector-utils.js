import { is } from 'immutable'
import { createSelectorCreator, defaultMemoize } from 'reselect'

/**
 * Creator for a memoized selector, using immutable.is as an equality check.
 */
export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  is
)

/**
 * Make an own selector for every instance of a component to cache selector results per instance
 *
 * @return {[function]} a function that when called, returns a memoized selector
 */
export const makeMemoizedSelector = (defaultSelector) => createDeepEqualSelector(
  (state, props, selector = defaultSelector) => {
    return selector(state, props)
  },
  data => data
)
