import {fromJS} from 'immutable'

/*Reducers*/
export const receiveEntity = (key) => (state, action) => {
  console.log('normalzed Data', action, 'key', key )
  if (action.response.entities && action.response.entities[key])
    return state.mergeDeep( state, fromJS(action.response.entities[key]) )

  return state
}

export const failEntity = (state/*, action*/) => {
  return state
}

export const removeEntity = (state, action) => {
  const id = action.response.id
  return state.delete(id)
}
