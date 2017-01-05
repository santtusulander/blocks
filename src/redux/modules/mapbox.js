import { createAction, handleActions } from 'redux-actions'
import Immutable from 'immutable'

const MAPBOX_SET_BOUNDS = 'MAPBOX_SET_BOUNDS'

const initialState = Immutable.fromJS({
  mapBounds: {}
})

// REDUCERS
export function mapboxMapBounds(state, action){
  return state.merge({
    mapBounds: Immutable.fromJS({
      south: action.payload.getSouth(),
      west: action.payload.getWest(),
      north: action.payload.getNorth(),
      east: action.payload.getEast()
    })
  })
}

export default handleActions({
  MAPBOX_SET_BOUNDS: mapboxMapBounds
}, initialState)

export const setMapBounds = createAction(MAPBOX_SET_BOUNDS)
