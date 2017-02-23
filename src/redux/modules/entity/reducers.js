import { fromJS } from 'immutable'

/*Reducers*/
export const receiveEntity = (key) => (state, action) => {
  const { response = {}, payload } = action

  // TODO: remove me after the new Redux modules (with API-middleware) is implemented
  if (!response.entities && payload) {
    response.entities = payload.entities
  }

  if (response.entities && response.entities[key]) {
    return state.mergeDeep(state, fromJS(response.entities[key]))
  }

  return state
}

export const failEntity = (state/*, action*/) => {
  return state
}

export const removeEntity = (state, action) => {
  const id = String(action.response.id)
  return state.delete(id)
}
