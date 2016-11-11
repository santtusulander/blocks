import {fromJS} from 'immutable'

/*Reducers*/
export const receive = (state, action) => {
  return state.merge( state, fromJS(action.payload.entities.properties))
}

export const fail = (state/*, action*/) => {
  return state
}
