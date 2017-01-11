import {fromJS} from 'immutable'

/*Reducers*/
export const receive = (state, action) => {
  if (action.payload.entities && action.payload.entities.properties )
    return state.merge( state, fromJS(action.payload.entities.properties))

  return state
}

export const fail = (state/*, action*/) => {
  return state
}
