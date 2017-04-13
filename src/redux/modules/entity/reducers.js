import { fromJS } from 'immutable'

/*Reducers*/

/**
 * Reducer for receiving entities.
 * @return {Immutable Map} state fragment
 */
export const receiveEntity = ({ key, useMergeDeep = true }) => (state, action) => {
  const { response = {}, payload } = action

  // TODO: remove me after the new Redux modules (with API-middleware) is implemented
  if (!response.entities && payload) {
    response.entities = payload.entities
  }

  if (response.entities && response.entities[key]) {
    return useMergeDeep
      ? state.mergeDeep(state, fromJS(response.entities[key]))
      : state.merge(state, fromJS(response.entities[key]))
  }

  return state
}

/**
 * Reducer for receiving metrics data for entities
 * @param  {[type]} key
 * @param  {[type]} comparison    if true, insert data into array for comparison data
 * @return {[Immutable Map]}      state fragment
 */
export const receiveMetrics = ({ key, comparison }) => (state, { response }) => {

  const metricsObject = comparison ? 'comparisonData' : 'data'

  if (response && response[key]) {
    return state.merge(fromJS({ [metricsObject]: response[key] }))
  }

  return state
}

/**
 * Reducer for receiving metrics data for muliple groups
 * @return {[Immutable Map]}      state fragment
 */
export const receiveGroupsMetrics = () => (state, { response }) => {
  const metricsObject = 'groupsData'
  //Convert response from array of arrays to array of object + filter empty arrays
  const flattenedResponse = [].concat.apply([],response.filter((resItem) => resItem.length))

  if (response) {
    return state.merge(fromJS({ [metricsObject]: flattenedResponse }))
  }

  return state
}

/**
 * Reducer for failed async actions
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
export const failEntity = (state/*, action*/) => {
  return state
}

/**
 * reducer for removing an entity
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 * @return {[type]}        [description]
 */
export const removeEntity = (state, action) => {
  const id = String(action.response.id)
debugger
  return state.delete(id)
}
