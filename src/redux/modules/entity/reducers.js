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
 * Reducer for receiving metrics data for a single group
 * @return {[Immutable Map]}      state fragment
 */
export const receiveGroupMetrics = () => (state, { response }) => {
  const metricsObject = 'groupData'

  if (response) {
    return state.merge(fromJS({ [metricsObject]: response }))
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
  return state.delete(id)
}

/**
 * Handles paginated resource entities / page
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 * @return {[type]}        [description]
 */
export const receiveEntityPagination = (state, action) => {

  //Is paginated response?
  const pagination = action.response.pagination
  if (pagination && pagination.page_size > -1)  {
    //use requestTag as pagination "key"
    const [reqId] = Object.keys(action.payload)
    const requestTag = action.payload[reqId].requestTag

    //calculate current page number
    const page = Math.floor(pagination.offset / pagination.page_size) + 1

    //state mock
    // {
    //   account: {
    //     meta: pagination
    //     1: {
    //       results: [ ids ...]
    //     }
    //   }
    // }
    //

    //FIXME: UDNP-3513 mergeDeep causes bug when two pages with same page numbers are fetched (combines result, but should be updating)

    return state.mergeDeep(fromJS({
      [requestTag]: {
        meta: pagination,
        [page]: action.response.result
      }
    }))



  }

  return state
}
