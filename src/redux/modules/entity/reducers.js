import {fromJS} from 'immutable'

/*Reducers*/
export const receiveEntity = (key) => (state, action) => {
  const { response = {} } = action
  if (response.entities && response.entities[key])
    return state.mergeDeep( state, fromJS(response.entities[key]) )

  return state
}

export const failEntity = (state/*, action*/) => {
  return state
}

export const removeEntity = (state, action) => {
  const id = action.response.id
  return state.delete(id)
}
